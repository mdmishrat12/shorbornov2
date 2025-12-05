import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { exams, questionPapers, examRegistrations } from '@/schema/user.schema';
import { getServerSession } from 'next-auth';
import { eq, and } from 'drizzle-orm';
import { authOptions } from '../../auth/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id: examId } = await params;

    console.log('Fetching exam with ID:', examId);

    if (!examId) {
      return NextResponse.json(
        { success: false, message: 'Exam ID is required' },
        { status: 400 }
      );
    }

    // First, check if the exam exists
    const [exam] = await db
      .select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);

    if (!exam) {
      console.log(`Exam not found: ${examId}`);
      return NextResponse.json(
        { success: false, message: 'Exam not found' },
        { status: 404 }
      );
    }

    // Get question paper details
    const [questionPaper] = await db
      .select()
      .from(questionPapers)
      .where(eq(questionPapers.id, exam.questionPaperId))
      .limit(1);

    // Check registration status for current user
    const [registration] = await db
      .select()
      .from(examRegistrations)
      .where(
        and(
          eq(examRegistrations.examId, examId),
          eq(examRegistrations.userId, session.user.id)
        )
      )
      .limit(1);

    // Prepare response data
    const responseData = {
      id: exam.id,
      title: exam.title,
      description: exam.description,
      code: exam.code,
      status: exam.status,
      scheduledStart: exam.scheduledStart,
      scheduledEnd: exam.scheduledEnd,
      duration: exam.duration,
      bufferTime: exam.bufferTime,
      accessType: exam.accessType,
      maxAttempts: exam.maxAttempts,
      retakeDelay: exam.retakeDelay,
      enableProctoring: exam.enableProctoring,
      requireWebcam: exam.requireWebcam,
      requireMicrophone: exam.requireMicrophone,
      allowTabSwitch: exam.allowTabSwitch,
      maxTabSwitches: exam.maxTabSwitches,
      showQuestionNumbers: exam.showQuestionNumbers,
      showTimer: exam.showTimer,
      showRemainingQuestions: exam.showRemainingQuestions,
      allowQuestionNavigation: exam.allowQuestionNavigation,
      allowQuestionReview: exam.allowQuestionReview,
      allowAnswerChange: exam.allowAnswerChange,
      showResultImmediately: exam.showResultImmediately,
      showAnswersAfterExam: exam.showAnswersAfterExam,
      showLeaderboard: exam.showLeaderboard,
      resultReleaseTime: exam.resultReleaseTime,
      passingScore: exam.passingScore,
      gradingMethod: exam.gradingMethod,
      allowNegativeMarking: exam.allowNegativeMarking,
      negativeMarkingPerQuestion: exam.negativeMarkingPerQuestion,
      totalRegistered: exam.totalRegistered,
      totalAttempted: exam.totalAttempted,
      averageScore: exam.averageScore,
      createdBy: exam.createdBy,
      questionPaperId: exam.questionPaperId,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
      questionPaper: questionPaper ? {
        id: questionPaper.id,
        title: questionPaper.title,
        description: questionPaper.description,
        totalMarks: questionPaper.totalMarks,
        duration: questionPaper.duration,
        status: questionPaper.status,
      } : null,
      isRegistered: !!registration,
      registrationStatus: registration?.status,
      isCreator: exam.createdBy === session.user.id,
    };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Error fetching exam details:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch exam details' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id: examId } = await params;
    const body = await request.json();

    // Check if exam exists and user is creator
    const [existingExam] = await db
      .select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);

    if (!existingExam) {
      return NextResponse.json(
        { success: false, message: 'Exam not found' },
        { status: 404 }
      );
    }

    if (existingExam.createdBy !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'You can only edit exams you created' },
        { status: 403 }
      );
    }

    // Validate schedule if being updated
    if (body.scheduledStart && body.scheduledEnd) {
      const start = new Date(body.scheduledStart);
      const end = new Date(body.scheduledEnd);
      const now = new Date();

      if (start < now) {
        return NextResponse.json(
          { success: false, message: 'Start time cannot be in the past' },
          { status: 400 }
        );
      }

      if (end <= start) {
        return NextResponse.json(
          { success: false, message: 'End time must be after start time' },
          { status: 400 }
        );
      }
    }

    // Update exam
    const [updatedExam] = await db
      .update(exams)
      .set({
        ...body,
        updatedAt: new Date(),
        updatedBy: session.user.id,
      })
      .where(eq(exams.id, examId))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Exam updated successfully',
      data: updatedExam,
    });
  } catch (error) {
    console.error('Error updating exam:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update exam' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
    const { id: examId } = await params;

    // Check if exam exists and user is creator
    const [existingExam] = await db
      .select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);

    if (!existingExam) {
      return NextResponse.json(
        { success: false, message: 'Exam not found' },
        { status: 404 }
      );
    }

    if (existingExam.createdBy !== session.user.id) {
      return NextResponse.json(
        { success: false, message: 'You can only delete exams you created' },
        { status: 403 }
      );
    }

    // Delete exam
    await db.delete(exams).where(eq(exams.id, examId));

    return NextResponse.json({
      success: true,
      message: 'Exam deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete exam' },
      { status: 500 }
    );
  }
}