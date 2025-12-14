// app/api/exams/[id]/attempt/[attemptId]/submit/route.ts - IMPROVED
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { 
  examAttempts, 
  userAnswers, 
  exams, 
  examRegistrations, 
  examLeaderboard 
} from '@/schema/user.schema';
import { getServerSession } from 'next-auth';
import { eq, and, desc, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '@/app/api/auth/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attemptId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: examId, attemptId } = await params;
    const userId = session.user.id;
    const now = new Date();

    console.log('=== SUBMITTING EXAM ===');
    console.log('Exam ID:', examId);
    console.log('Attempt ID:', attemptId);
    console.log('User ID:', userId);
    console.log('Time:', now.toISOString());

    // Verify attempt ownership and status
    const [attempt] = await db.select()
      .from(examAttempts)
      .where(
        and(
          eq(examAttempts.id, attemptId),
          eq(examAttempts.examId, examId),
          eq(examAttempts.userId, userId)
        )
      )
      .limit(1);

    if (!attempt) {
      console.error('Attempt not found');
      return NextResponse.json(
        { success: false, message: 'Attempt not found' },
        { status: 404 }
      );
    }

    // Check if already submitted
    if (attempt.status === 'submitted') {
      console.log('Already submitted');
      return NextResponse.json(
        { success: false, message: 'Exam already submitted' },
        { status: 400 }
      );
    }

    // Allow submission even if not in_progress (for auto-submit on timeout)
    console.log('Current attempt status:', attempt.status);

    // Get exam details
    const [exam] = await db.select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);

    if (!exam) {
      console.error('Exam not found');
      return NextResponse.json(
        { success: false, message: 'Exam not found' },
        { status: 404 }
      );
    }

    console.log('Exam found:', exam.title);

    // Calculate final score
    const answers = await db.select()
      .from(userAnswers)
      .where(eq(userAnswers.attemptId, attemptId));

    console.log('Total answers found:', answers.length);

    const totalMarks = answers.reduce((sum, ans) => sum + (ans.marksObtained || 0), 0);
    const totalNegative = answers.reduce((sum, ans) => sum + (ans.negativeMarks || 0), 0);
    const finalScore = Math.max(0, totalMarks - totalNegative);
    
    const correctAnswers = answers.filter(ans => ans.isCorrect).length;
    const attemptedQuestions = answers.filter(ans => ans.selectedOption && ans.selectedOption !== '').length;
    
    const maxPossibleMarks = attempt.totalQuestions * 1;
    const percentage = maxPossibleMarks > 0 
      ? Math.round((finalScore / maxPossibleMarks) * 100) 
      : 0;

    const timeSpent = Math.round((now.getTime() - attempt.startedAt.getTime()) / 1000);
    const accuracy = attemptedQuestions > 0 
      ? Math.round((correctAnswers / attemptedQuestions) * 100) 
      : 0;

    console.log('=== SCORE CALCULATION ===');
    console.log('Total marks:', totalMarks);
    console.log('Negative marks:', totalNegative);
    console.log('Final score:', finalScore);
    console.log('Correct answers:', correctAnswers);
    console.log('Attempted questions:', attemptedQuestions);
    console.log('Percentage:', percentage);
    console.log('Accuracy:', accuracy);
    console.log('Time spent:', timeSpent, 'seconds');

    // Update attempt with final scores
    console.log('Updating attempt...');
    const [updatedAttempt] = await db.update(examAttempts)
      .set({
        submittedAt: now,
        status: 'submitted',
        timeSpent,
        completionStatus: 'completed',
        correctAnswers,
        incorrectAnswers: attemptedQuestions - correctAnswers,
        skippedQuestions: attempt.totalQuestions - attemptedQuestions,
        totalMarks: maxPossibleMarks,
        obtainedMarks: finalScore,
        percentage,
        negativeMarks: totalNegative,
        finalScore,
        result: finalScore >= exam.passingScore ? 'pass' : 'fail',
        updatedAt: now
      })
      .where(eq(examAttempts.id, attemptId))
      .returning();

    console.log('Attempt updated successfully');

    // Update exam registration
    console.log('Updating registration...');
    await db.update(examRegistrations)
      .set({
        attemptsUsed: sql`${examRegistrations.attemptsUsed} + 1`,
        lastAttemptAt: now,
        nextAttemptAllowedAt: exam.retakeDelay 
          ? new Date(now.getTime() + exam.retakeDelay * 60 * 60 * 1000)
          : null,
        updatedAt: now
      })
      .where(
        and(
          eq(examRegistrations.examId, examId),
          eq(examRegistrations.userId, userId)
        )
      );

    console.log('Registration updated');

    // Calculate rank
    console.log('Calculating rank...');
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

    console.log('Rank:', userRank, '/', totalParticipants);
    console.log('Percentile:', percentile);

    // Update attempt with rank
    await db.update(examAttempts)
      .set({
        rank: userRank,
        percentile,
        updatedAt: now
      })
      .where(eq(examAttempts.id, attemptId));

    // Update exam statistics
    console.log('Updating exam statistics...');
    const avgScore = allAttempts.length > 0
      ? Math.round(
          allAttempts.reduce((sum, att) => sum + (att.finalScore || 0), 0) / 
          allAttempts.length
        )
      : 0;

    await db.update(exams)
      .set({
        totalAttempted: sql`${exams.totalAttempted} + 1`,
        averageScore: avgScore,
        updatedAt: now
      })
      .where(eq(exams.id, examId));

    console.log('Exam statistics updated');

    // Update or create leaderboard entry
    console.log('Updating leaderboard...');
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
        console.log('Leaderboard entry updated');
      } else {
        console.log('Leaderboard entry not updated (lower score)');
      }
    } else {
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
      console.log('New leaderboard entry created');
    }

    console.log('=== SUBMISSION COMPLETE ===');

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
          incorrectAnswers: attemptedQuestions - correctAnswers,
          skippedQuestions: attempt.totalQuestions - attemptedQuestions,
          attemptedQuestions,
          totalQuestions: attempt.totalQuestions,
          accuracy,
          timeSpent: Math.floor(timeSpent / 60), // Convert to minutes
          passingScore: exam.passingScore
        },
        showAnswers: exam.showAnswersAfterExam,
        showLeaderboard: exam.showLeaderboard,
        resultReleaseTime: exam.resultReleaseTime
      }
    });
  } catch (error) {
    console.error('=== ERROR SUBMITTING EXAM ===');
    console.error(error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit exam',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}