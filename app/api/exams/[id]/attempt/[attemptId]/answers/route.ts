// app/api/exams/[id]/attempt/[attemptId]/answers/route.ts - COMPLETE WITH GET + POST
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { examAttempts, userAnswers, questionPaperItems, questionBank } from '@/schema/user.schema';
import { getServerSession } from 'next-auth';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '@/app/api/auth/auth';

// GET - Fetch all answers for an attempt
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

    const { id: examId, attemptId } = await params;
    const userId = session.user.id;

    console.log('Fetching answers:', { examId, attemptId, userId });

    // Verify attempt ownership
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
      return NextResponse.json(
        { success: false, message: 'Attempt not found' },
        { status: 404 }
      );
    }

    // Get all answers for this attempt
    const answers = await db.select()
      .from(userAnswers)
      .where(eq(userAnswers.attemptId, attemptId));

    console.log('Found answers:', answers.length);

    return NextResponse.json({
      success: true,
      data: answers,
    });
  } catch (error) {
    console.error('Error fetching answers:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch answers',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Save/update an answer
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
    const body = await request.json();

    console.log('Saving answer:', { examId, attemptId, body });

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
      // Apply negative marking if enabled (default 25%)
      negativeMarks = 0.25 * (questionItem.item.marks || 1);
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
          isFlagged: body.isFlagged !== undefined ? body.isFlagged : existingAnswer[0].isFlagged,
          timeSpent: body.timeSpent || existingAnswer[0].timeSpent,
          lastViewedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(userAnswers.id, existingAnswer[0].id))
        .returning();

      console.log('Answer updated:', savedAnswer.id);
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

      console.log('New answer created:', savedAnswer.id);
    }

    // Update attempt statistics
    const allAnswers = await db.select()
      .from(userAnswers)
      .where(eq(userAnswers.attemptId, attemptId));

    const attemptedCount = allAnswers.filter(ans => 
      ans.selectedOption && ans.selectedOption !== ''
    ).length;

    await db.update(examAttempts)
      .set({
        attemptedQuestions: attemptedCount,
        timeSpent: body.totalTimeSpent || attempt.timeSpent,
        updatedAt: new Date()
      })
      .where(eq(examAttempts.id, attemptId));

    return NextResponse.json({
      success: true,
      message: 'Answer saved successfully',
      data: {
        answer: savedAnswer,
        isCorrect,
        marksObtained,
        negativeMarks
      }
    });
  } catch (error) {
    console.error('Error saving answer:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to save answer',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}