import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { exams, examRegistrations, users } from '@/schema/user.schema';
import { getServerSession } from 'next-auth';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '@/app/api/auth/auth';

export async function POST(
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
    const userId = session.user.id;

    console.log('Registering for exam with ID:', examId);

    // Check if exam exists
    const [exam] = await db
      .select()
      .from(exams)
      .where(eq(exams.id, examId));

    if (!exam) {
      return NextResponse.json(
        { success: false, message: 'Exam not found' },
        { status: 404 }
      );
    }

    console.log('Exam found:', {
      id: exam.id,
      title: exam.title,
      status: exam.status,
      scheduledStart: exam.scheduledStart,
      scheduledEnd: exam.scheduledEnd,
      accessType: exam.accessType,
    });

    // Check exam status - allow registration for scheduled, live, and draft exams
    const allowedStatuses = ['draft', 'scheduled', 'live'];
    if (!allowedStatuses.includes(exam.status)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Exam is not open for registration. Current status: ${exam.status}` 
        },
        { status: 400 }
      );
    }

    // Check if already registered
    const existingRegistration = await db
      .select()
      .from(examRegistrations)
      .where(
        and(
          eq(examRegistrations.examId, examId),
          eq(examRegistrations.userId, userId)
        )
      )
      .limit(1);

    if (existingRegistration.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Already registered for this exam',
          data: existingRegistration[0] 
        },
        { status: 400 }
      );
    }

    // Get user details
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // Check access type and password
    let requestBody = {};
    try {
      requestBody = await request.json();
    } catch (error) {
      // No body provided, continue without password
    }

    if (exam.accessType === 'private') {
      if (!requestBody.password || requestBody.password !== exam.password) {
        return NextResponse.json(
          { success: false, message: 'Invalid password' },
          { status: 401 }
        );
      }
    }

    // Determine registration status based on access type
    let status: 'pending' | 'approved' = 'pending';
    let approvedBy: string | null = null;
    let approvedAt: Date | null = null;
    
    if (exam.accessType === 'public' || exam.accessType === 'private') {
      status = 'approved';
      approvedAt = new Date();
      approvedBy = userId; // Set to current user ID instead of 'system'
    }
    // 'invite' type remains pending

    // Create registration - FIX: Don't set approved_by for system approvals
    const registrationData: any = {
      id: uuidv4(),
      examId,
      userId,
      registrationType: 'regular',
      status,
      registeredAt: new Date(),
      attemptsUsed: 0,
    };

    // Only set approvedAt and approvedBy if status is approved
    if (status === 'approved') {
      registrationData.approvedAt = approvedAt;
      if (approvedBy) {
        registrationData.approvedBy = approvedBy;
      }
    }

    const [registration] = await db.insert(examRegistrations)
      .values(registrationData)
      .returning();

    // Update exam registration count if approved
    if (status === 'approved') {
      await db
        .update(exams)
        .set({
          totalRegistered: (exam.totalRegistered || 0) + 1,
          updatedAt: new Date(),
        })
        .where(eq(exams.id, examId));
    }

    return NextResponse.json({
      success: true,
      message: exam.accessType === 'public' || exam.accessType === 'private'
        ? 'Successfully registered for exam' 
        : 'Registration submitted for approval',
      data: {
        ...registration,
        user: {
          name: user?.name,
          email: user?.email,
        },
      },
    });
  } catch (error) {
    console.error('Error registering for exam:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to register for exam', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}