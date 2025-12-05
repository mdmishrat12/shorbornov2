// app/api/exams/[examId]/start/route.ts - UPDATED
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { 
  exams, 
  examAttempts, 
  examRegistrations, 
  questionPapers, 
  questionPaperItems,
  examSessions 
} from '@/schema/user.schema';
import { getServerSession } from 'next-auth';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '../../../auth/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { examId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const examId = params.examId;
    const userId = session.user.id;
    const now = new Date();

    // Check if exam exists
    const [exam] = await db.select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);

    if (!exam) {
      return NextResponse.json(
        { success: false, message: 'Exam not found' },
        { status: 404 }
      );
    }

    // Check exam status
    if (exam.status !== 'live') {
      return NextResponse.json(
        { 
          success: false, 
          message: `Exam is not live. Current status: ${exam.status}` 
        },
        { status: 403 }
      );
    }

    // Check exam timing
    const startTime = new Date(exam.scheduledStart);
    const endTime = new Date(exam.scheduledEnd);

    if (now < startTime) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Exam starts at ${startTime.toLocaleString()}` 
        },
        { status: 403 }
      );
    }

    if (now > endTime) {
      return NextResponse.json(
        { success: false, message: 'Exam has ended' },
        { status: 403 }
      );
    }

    // Check if user is registered
    const [registration] = await db.select()
      .from(examRegistrations)
      .where(
        and(
          eq(examRegistrations.examId, examId),
          eq(examRegistrations.userId, userId)
        )
      )
      .limit(1);

    if (!registration) {
      return NextResponse.json(
        { success: false, message: 'You are not registered for this exam' },
        { status: 403 }
      );
    }

    if (registration.status !== 'approved') {
      return NextResponse.json(
        { 
          success: false, 
          message: `Your registration is ${registration.status}` 
        },
        { status: 403 }
      );
    }

    // Check max attempts
    if (exam.maxAttempts > 0) {
      const attemptsCount = await db
        .select({ count: db.fn.count() })
        .from(examAttempts)
        .where(
          and(
            eq(examAttempts.examId, examId),
            eq(examAttempts.userId, userId)
          )
        );

      const count = attemptsCount[0]?.count || 0;
      if (count >= exam.maxAttempts) {
        return NextResponse.json(
          { success: false, message: 'Maximum attempts reached' },
          { status: 403 }
        );
      }
    }

    // Check for existing in-progress attempt
    const [existingAttempt] = await db.select()
      .from(examAttempts)
      .where(
        and(
          eq(examAttempts.examId, examId),
          eq(examAttempts.userId, userId),
          eq(examAttempts.status, 'in_progress')
        )
      )
      .limit(1);

    if (existingAttempt) {
      // Resume existing attempt
      return NextResponse.json({
        success: true,
        message: 'Resuming existing attempt',
        data: {
          attempt: existingAttempt,
          resume: true
        }
      });
    }

    // Get question paper
    const [questionPaper] = await db.select()
      .from(questionPapers)
      .where(eq(questionPapers.id, exam.questionPaperId))
      .limit(1);

    if (!questionPaper) {
      return NextResponse.json(
        { success: false, message: 'Question paper not found' },
        { status: 404 }
      );
    }

    // Get question count
    const questionItems = await db.select()
      .from(questionPaperItems)
      .where(eq(questionPaperItems.questionPaperId, questionPaper.id));

    // Create new attempt
    const attemptId = uuidv4();
    const startedAt = new Date();
    const scheduledEndAt = new Date(startedAt.getTime() + (exam.duration * 60000));

    const [newAttempt] = await db.insert(examAttempts).values({
      id: attemptId,
      examId,
      userId,
      registrationId: registration.id,
      startedAt,
      scheduledEndAt,
      status: 'in_progress',
      totalQuestions: questionItems.length,
      shuffleSeed: Math.floor(Math.random() * 1000000),
      timeSpent: 0
    }).returning();

    // Create exam session
    const sessionId = uuidv4();
    await db.insert(examSessions).values({
      id: sessionId,
      attemptId,
      userId,
      sessionToken: uuidv4(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      currentQuestion: 1,
      isActive: true
    });

    return NextResponse.json({
      success: true,
      message: 'Exam started successfully',
      data: {
        attempt: newAttempt,
        exam: {
          ...exam,
          duration: exam.duration,
          questionCount: questionItems.length
        }
      }
    });
  } catch (error) {
    console.error('Error starting exam:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to start exam' },
      { status: 500 }
    );
  }
}