// app/api/exams/[id]/attempt/[attemptId]/status/route.ts - FIXED
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { examAttempts, exams } from '@/schema/user.schema';
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

    const { id: examId, attemptId } = await params;
    const userId = session.user.id;

    console.log('Checking attempt status:', { examId, attemptId, userId });

    // Check if attempt exists and belongs to user
    const [attempt] = await db.select()
      .from(examAttempts)
      .where(
        and(
          eq(examAttempts.id, attemptId),
          eq(examAttempts.userId, userId),
          eq(examAttempts.examId, examId)
        )
      )
      .limit(1);

    if (!attempt) {
      return NextResponse.json(
        { success: false, message: 'Exam attempt not found' },
        { status: 404 }
      );
    }

    // Get exam details
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

    // Check if attempt can be resumed
    const now = new Date();
    const canResume = (
      attempt.status === 'in_progress' ||
      attempt.status === 'not_started'
    ) && (
      !attempt.scheduledEndAt ||
      new Date(attempt.scheduledEndAt) > now
    );

    return NextResponse.json({
      success: true,
      data: {
        attempt,
        exam,
        canResume,
        now,
        scheduledEndAt: attempt.scheduledEndAt
      }
    });
  } catch (error) {
    console.error('Error checking attempt status:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to check attempt status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}