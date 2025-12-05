// app/api/exams/[examId]/attempt/[attemptId]/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { examAttempts, userAnswers, exams, examRegistrations, examLeaderboard } from '@/schema/user.schema';
import { getServerSession } from 'next-auth';
import { eq, and, desc, count, sum, avg, sql } from 'drizzle-orm';
import { authOptions } from '@/app/api/auth/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { examId: string; attemptId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { examId, attemptId } = params;
    const userId = session.user.id;
    const now = new Date();

    // Verify attempt ownership
    const [attempt] = await db.select()
      .from(examAttempts)
      .where(
        and(
          eq(examAttempts.id, attemptId),
          eq(examAttempts.examId, examId),
          eq(examAttempts.userId, userId),
          eq(examAttempts.status, 'in_progress')
        )
      )
      .limit(1);

    if (!attempt) {
      return NextResponse.json(
        { success: false, message: 'Attempt not found or not in progress' },
        { status: 404 }
      );
    }

    // Get exam details
    const [exam] = await db.select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);

    // Calculate final score
    const answers = await db.select()
      .from(userAnswers)
      .where(eq(userAnswers.attemptId, attemptId));

    const totalMarks = answers.reduce((sum, ans) => sum + (ans.marksObtained || 0), 0);
    const totalNegative = answers.reduce((sum, ans) => sum + (ans.negativeMarks || 0), 0);
    const finalScore = Math.max(0, totalMarks - totalNegative);
    
    const correctAnswers = answers.filter(ans => ans.isCorrect).length;
    const attemptedQuestions = answers.filter(ans => ans.selectedOption && ans.selectedOption !== '').length;
    
    const percentage = attempt.totalQuestions > 0 
      ? Math.round((finalScore / (attempt.totalQuestions * (exam.passingScore / 40))) * 100) // Normalize to passing score
      : 0;

    const timeSpent = Math.round((now.getTime() - attempt.startedAt.getTime()) / 1000);
    const accuracy = attemptedQuestions > 0 
      ? Math.round((correctAnswers / attemptedQuestions) * 100) 
      : 0;

    // Update attempt with final scores
    const [updatedAttempt] = await db.update(examAttempts)
      .set({
        submittedAt: now,
        status: 'submitted',
        timeSpent,
        completionStatus: 'completed',
        correctAnswers,
        incorrectAnswers: attemptedQuestions - correctAnswers,
        skippedQuestions: attempt.totalQuestions - attemptedQuestions,
        totalMarks: attempt.totalQuestions * (exam.passingScore / 40), // Weighted total
        obtainedMarks: finalScore,
        percentage,
        negativeMarks: totalNegative,
        finalScore,
        result: finalScore >= exam.passingScore ? 'pass' : 'fail'
      })
      .where(eq(examAttempts.id, attemptId))
      .returning();

    // Update exam registration
    await db.update(examRegistrations)
      .set({
        attemptsUsed: sql`${examRegistrations.attemptsUsed} + 1`,
        lastAttemptAt: now,
        nextAttemptAllowedAt: exam.retakeDelay 
          ? new Date(now.getTime() + exam.retakeDelay * 60 * 1000)
          : null
      })
      .where(
        and(
          eq(examRegistrations.examId, examId),
          eq(examRegistrations.userId, userId)
        )
      );

    // Update exam statistics
    await db.update(exams)
      .set({
        totalAttempted: sql`${exams.totalAttempted} + 1`,
        averageScore: db.select({ avg: avg(examAttempts.finalScore) })
          .from(examAttempts)
          .where(
            and(
              eq(examAttempts.examId, examId),
              eq(examAttempts.status, 'submitted')
            )
          )
      })
      .where(eq(exams.id, examId));

    // Calculate rank and percentile
    const allAttempts = await db.select()
      .from(examAttempts)
      .where(
        and(
          eq(examAttempts.examId, examId),
          eq(examAttempts.status, 'submitted')
        )
      )
      .orderBy(desc(examAttempts.finalScore));

    const userRank = allAttempts.findIndex(att => att.id === attemptId) + 1;
    const totalParticipants = allAttempts.length;
    const percentile = totalParticipants > 0 
      ? Math.round(((totalParticipants - userRank) / totalParticipants) * 100)
      : 0;

    // Update attempt with rank
    await db.update(examAttempts)
      .set({
        rank: userRank,
        percentile
      })
      .where(eq(examAttempts.id, attemptId));

    // Update or create leaderboard entry
    const existingLeaderboard = await db.select()
      .from(examLeaderboard)
      .where(
        and(
          eq(examLeaderboard.examId, examId),
          eq(examLeaderboard.userId, userId)
        )
      )
      .limit(1);

    if (existingLeaderboard.length > 0) {
      // Update if new score is higher (for multiple attempts)
      if (finalScore > existingLeaderboard[0].score) {
        await db.update(examLeaderboard)
          .set({
            score: finalScore,
            percentage,
            rank: userRank,
            timeTaken: timeSpent,
            submissionTime: now,
            accuracy,
            questionsAttempted: attemptedQuestions,
            correctAnswers,
            calculatedAt: now
          })
          .where(eq(examLeaderboard.id, existingLeaderboard[0].id));
      }
    } else {
      // Create new leaderboard entry
      await db.insert(examLeaderboard).values({
        id: uuidv4(),
        examId,
        userId,
        attemptId,
        score: finalScore,
        percentage,
        rank: userRank,
        timeTaken: timeSpent,
        submissionTime: now,
        accuracy,
        questionsAttempted: attemptedQuestions,
        correctAnswers,
        calculatedAt: now
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Exam submitted successfully',
      data: {
        attempt: updatedAttempt,
        score: {
          total: finalScore,
          percentage,
          rank: userRank,
          percentile,
          result: finalScore >= exam.passingScore ? 'pass' : 'fail',
          correctAnswers,
          attemptedQuestions,
          totalQuestions: attempt.totalQuestions,
          accuracy,
          timeSpent: Math.floor(timeSpent / 60) // Convert to minutes
        },
        showAnswers: exam.showAnswersAfterExam,
        showLeaderboard: exam.showLeaderboard,
        resultReleaseTime: exam.resultReleaseTime
      }
    });
  } catch (error) {
    console.error('Error submitting exam:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit exam' },
      { status: 500 }
    );
  }
}