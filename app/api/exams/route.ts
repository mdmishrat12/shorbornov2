import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { exams } from '@/schema/user.schema';
import { getServerSession } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';
import { eq, and, or, gte, lte, like, sql } from 'drizzle-orm';
import { authOptions } from '../auth/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type'); // 'created' or 'participating'

    let query = db.select().from(exams);

    if (type === 'created') {
      // Exams created by the user
      query = query.where(eq(exams.createdBy, session.user.id));
    } else if (type === 'participating') {
      // Exams where user is registered
      // This requires a more complex query - we'll handle in a separate endpoint
      query = query.where(sql`1=0`); // Temporary
    }

    if (status) {
      query = query.where(eq(exams.status, status));
    }

    if (search) {
      query = query.where(
        or(
          like(exams.title, `%${search}%`),
          like(exams.description, `%${search}%`),
          like(exams.code, `%${search}%`)
        )
      );
    }

    query = query.limit(limit).offset(offset).orderBy(exams.scheduledStart);

    const examsList = await query;
    
    return NextResponse.json({
      success: true,
      data: examsList,
      pagination: {
        limit,
        offset,
        total: examsList.length
      }
    });
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch exams' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const userId = session.user.id;

    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      );
    }

    if (!body.questionPaperId) {
      return NextResponse.json(
        { success: false, message: 'Question paper is required' },
        { status: 400 }
      );
    }

    if (!body.scheduledStart || !body.scheduledEnd) {
      return NextResponse.json(
        { success: false, message: 'Schedule start and end times are required' },
        { status: 400 }
      );
    }

    if (!body.duration || body.duration <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid duration is required' },
        { status: 400 }
      );
    }

    // Validate schedule
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

    if (body.duration > ((end.getTime() - start.getTime()) / (1000 * 60))) {
      return NextResponse.json(
        { success: false, message: 'Duration cannot exceed the exam window' },
        { status: 400 }
      );
    }

    // Generate exam code if not provided
    const examCode = body.code || `EXAM-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create exam
    const [exam] = await db.insert(exams).values({
      id: uuidv4(),
      title: body.title,
      description: body.description,
      code: examCode,
      questionPaperId: body.questionPaperId,
      scheduledStart: start,
      scheduledEnd: end,
      duration: body.duration,
      bufferTime: body.bufferTime || 15,
      accessType: body.accessType || 'public',
      password: body.password,
      maxAttempts: body.maxAttempts || 1,
      retakeDelay: body.retakeDelay,
      enableProctoring: body.enableProctoring || false,
      requireWebcam: body.requireWebcam || false,
      requireMicrophone: body.requireMicrophone || false,
      allowTabSwitch: body.allowTabSwitch || false,
      maxTabSwitches: body.maxTabSwitches || 0,
      showQuestionNumbers: body.showQuestionNumbers ?? true,
      showTimer: body.showTimer ?? true,
      showRemainingQuestions: body.showRemainingQuestions ?? true,
      allowQuestionNavigation: body.allowQuestionNavigation ?? true,
      allowQuestionReview: body.allowQuestionReview ?? true,
      allowAnswerChange: body.allowAnswerChange ?? true,
      showResultImmediately: body.showResultImmediately || false,
      showAnswersAfterExam: body.showAnswersAfterExam || false,
      showLeaderboard: body.showLeaderboard ?? true,
      resultReleaseTime: body.resultReleaseTime ? new Date(body.resultReleaseTime) : null,
      passingScore: body.passingScore || 40,
      gradingMethod: body.gradingMethod || 'auto',
      allowNegativeMarking: body.allowNegativeMarking || false,
      negativeMarkingPerQuestion: body.negativeMarkingPerQuestion || 0,
      status: 'draft',
      createdBy: userId,
      totalRegistered: 0,
      totalAttempted: 0,
      averageScore: 0,
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Exam created successfully',
      data: exam,
    });
  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create exam' },
      { status: 500 }
    );
  }
}