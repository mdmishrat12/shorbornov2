// app/api/exams/[id]/access/route.ts - NEW FILE
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { exams, examRegistrations } from '@/schema/user.schema';
import { getServerSession } from 'next-auth';
import { eq, and } from 'drizzle-orm';
import { authOptions } from '../../../auth/auth';

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

    const { id: examId } = await params;
    const userId = session.user.id;

    console.log('Checking exam access:', { examId, userId });

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
      return NextResponse.json({
        success: false,
        message: 'You are not registered for this exam',
        data: { exam }
      }, { status: 403 });
    }

    if (registration.status !== 'approved') {
      return NextResponse.json({
        success: false,
        message: `Your registration is ${registration.status}`,
        data: { exam, registration }
      }, { status: 403 });
    }

    // Check exam timing
    const now = new Date();
    const startTime = new Date(exam.scheduledStart);
    const endTime = new Date(exam.scheduledEnd);

    if (now < startTime) {
      return NextResponse.json({
        success: false,
        message: `Exam starts at ${startTime.toLocaleString()}`,
        data: {
          exam,
          registration,
          canStart: false,
          reason: `Exam starts at ${startTime.toLocaleString()}`,
          availableAt: startTime
        }
      }, { status: 200 }); // Return 200 with canStart: false
    }

    if (now > endTime) {
      return NextResponse.json({
        success: false,
        message: 'Exam has ended',
        data: {
          exam,
          registration,
          canStart: false,
          reason: 'Exam has ended',
          endedAt: endTime
        }
      }, { status: 200 }); // Return 200 with canStart: false
    }

    // All checks passed
    return NextResponse.json({
      success: true,
      message: 'You can access this exam',
      data: {
        exam,
        registration,
        canStart: true,
        currentTime: now,
        examWindow: {
          start: startTime,
          end: endTime
        }
      }
    });
  } catch (error) {
    console.error('Error checking exam access:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to check exam access',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}