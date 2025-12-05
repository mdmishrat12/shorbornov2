// app/api/exams/[examId]/attempt/[attemptId]/answer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { examAttempts, userAnswers, questionPaperItems, questionBank } from '@/schema/user.schema';
import { getServerSession } from 'next-auth';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
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
    const body = await request.json();

    // Validate required fields
    if (!body.questionPaperItemId || !body.selectedOption) {
      return NextResponse.json(
        { success: false, message: 'Question ID and selected option are required' },
        { status: 400 }
      );
    }

    // Verify attempt ownership and status
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

    // Check if time has expired
    if (attempt.scheduledEndAt && new Date() > attempt.scheduledEndAt) {
      return NextResponse.json(
        { success: false, message: 'Exam time has expired' },
        { status: 400 }
      );
    }

    // Get question details
    const [questionItem] = await db
      .select({
        item: questionPaperItems,
        question: questionBank
      })
      .from(questionPaperItems)
      .leftJoin(questionBank, eq(questionPaperItems.questionId, questionBank.id))
      .where(eq(questionPaperItems.id, body.questionPaperItemId))
      .limit(1);

    if (!questionItem) {
      return NextResponse.json(
        { success: false, message: 'Question not found' },
        { status: 404 }
      );
    }

    // Determine correct answer
    const correctAnswer = questionItem.item.isCustom 
      ? questionItem.item.customCorrectAnswer
      : questionItem.question?.correctAnswer;

    const isCorrect = body.selectedOption === correctAnswer;

    // Calculate marks
    let marksObtained = 0;
    let negativeMarks = 0;

    if (isCorrect) {
      marksObtained = questionItem.item.marks || 1;
    } else if (body.selectedOption && body.selectedOption !== '') {
      // Apply negative marking if enabled
      negativeMarks = 0.25 * (questionItem.item.marks || 1); // Default 25% negative marking
    }

    // Check if answer already exists
    const existingAnswer = await db.select()
      .from(userAnswers)
      .where(
        and(
          eq(userAnswers.attemptId, attemptId),
          eq(userAnswers.questionPaperItemId, body.questionPaperItemId)
        )
      )
      .limit(1);

    let savedAnswer;
    const answeredAt = new Date();

    if (existingAnswer.length > 0) {
      // Update existing answer
      [savedAnswer] = await db.update(userAnswers)
        .set({
          selectedOption: body.selectedOption,
          isCorrect,
          marksObtained,
          negativeMarks,
          answeredAt,
          isFlagged: body.isFlagged || existingAnswer[0].isFlagged,
          timeSpent: body.timeSpent || existingAnswer[0].timeSpent,
          updatedAt: new Date()
        })
        .where(eq(userAnswers.id, existingAnswer[0].id))
        .returning();
    } else {
      // Create new answer
      [savedAnswer] = await db.insert(userAnswers).values({
        id: uuidv4(),
        attemptId,
        questionPaperItemId: body.questionPaperItemId,
        questionId: questionItem.item.questionId,
        selectedOption: body.selectedOption,
        isCorrect,
        marksObtained,
        negativeMarks,
        answeredAt,
        isFlagged: body.isFlagged || false,
        timeSpent: body.timeSpent || 0,
        firstViewedAt: body.firstViewedAt ? new Date(body.firstViewedAt) : new Date(),
        lastViewedAt: new Date()
      }).returning();
    }

    // Update attempt statistics
    const [updatedAttempt] = await db.update(examAttempts)
      .set({
        attemptedQuestions: db.select({ count: db.fn.count() })
          .from(userAnswers)
          .where(
            and(
              eq(userAnswers.attemptId, attemptId),
              eq(userAnswers.selectedOption, '') // Not empty = attempted
            )
          ),
        timeSpent: body.totalTimeSpent || attempt.timeSpent
      })
      .where(eq(examAttempts.id, attemptId))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Answer saved successfully',
      data: {
        answer: savedAnswer,
        attempt: updatedAttempt,
        correctAnswer,
        explanation: questionItem.question?.explanation
      }
    });
  } catch (error) {
    console.error('Error saving answer:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save answer' },
      { status: 500 }
    );
  }
}