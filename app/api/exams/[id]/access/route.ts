// app/api/exams/[examId]/access/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { exams, examRegistrations } from '@/schema/user.schema';
import { getServerSession } from 'next-auth';
import { eq, and } from 'drizzle-orm';
import { authOptions } from '../../../auth/auth';

export async function GET(
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

    // Check exam timing
    const now = new Date();
    const startTime = new Date(exam.scheduledStart);
    const endTime = new Date(exam.scheduledEnd);

    if (now < startTime) {
      return NextResponse.json({
        success: true,
        data: {
          exam,
          registration,
          canStart: false,
          reason: `Exam starts at ${startTime.toLocaleString()}`,
          availableAt: startTime
        }
      });
    }

    if (now > endTime) {
      return NextResponse.json({
        success: true,
        data: {
          exam,
          registration,
          canStart: false,
          reason: 'Exam has ended',
          endedAt: endTime
        }
      });
    }

    return NextResponse.json({
      success: true,
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
      { success: false, message: 'Failed to check exam access' },
      { status: 500 }
    );
  }
}