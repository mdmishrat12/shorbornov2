import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { exams, examAttempts, userAnswers, questionPaperItems, questionBank } from '@/schema/user.schema';
import { getServerSession } from 'next-auth';
import { eq, and } from 'drizzle-orm';
import { authOptions } from '@/app/api/auth/auth';

export async function GET(
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

    // IMPORTANT: Unwrap the params Promise
    const { id: examId, attemptId } = await params;
    const userId = session.user.id;

    console.log('Fetching attempt:', { examId, attemptId });

    // Get attempt with exam details
    const attemptData = await db
      .select({
        attempt: examAttempts,
        exam: {
          id: exams.id,
          title: exams.title,
          showResultImmediately: exams.showResultImmediately,
          showAnswersAfterExam: exams.showAnswersAfterExam,
          allowNegativeMarking: exams.allowNegativeMarking,
          negativeMarkingPerQuestion: exams.negativeMarkingPerQuestion,
          passingScore: exams.passingScore,
        },
      })
      .from(examAttempts)
      .leftJoin(exams, eq(examAttempts.examId, exams.id))
      .where(
        and(
          eq(examAttempts.id, attemptId),
          eq(examAttempts.examId, examId),
          eq(examAttempts.userId, userId)
        )
      )
      .limit(1);

    if (attemptData.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Attempt not found' },
        { status: 404 }
      );
    }

    const { attempt, exam } = attemptData[0];

    // Get user answers for this attempt
    const answers = await db
      .select()
      .from(userAnswers)
      .where(eq(userAnswers.attemptId, attemptId));

    return NextResponse.json({
      success: true,
      data: {
        attempt,
        exam,
        answers,
        canViewAnswers: attempt.status === 'submitted' && exam?.showAnswersAfterExam,
        canViewResult: attempt.status === 'submitted' && exam?.showResultImmediately,
      },
    });
  } catch (error) {
    console.error('Error fetching attempt:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch attempt details' },
      { status: 500 }
    );
  }
}