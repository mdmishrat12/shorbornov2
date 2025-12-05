import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/db';
import { questionBank } from '@/schema/user.schema';
import { eq, and } from 'drizzle-orm';
import { authOptions } from '../../auth/auth';

interface RouteParams {
  params: Promise<{
    id: string;
  }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const question = await db
      .select()
      .from(questionBank)
      .where(eq(questionBank.id, id))
      .then(res => res[0]);

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check if question exists and user is the creator
    const existingQuestion = await db
      .select()
      .from(questionBank)
      .where(
        and(
          eq(questionBank.id, id),
          eq(questionBank.createdBy, session.user.id)
        )
      )
      .then(res => res[0]);

    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question not found or access denied' }, { status: 404 });
    }

    // Update question
    const [updatedQuestion] = await db
      .update(questionBank)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(questionBank.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Question updated successfully',
      data: updatedQuestion,
    });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if question exists and user is the creator
    const existingQuestion = await db
      .select()
      .from(questionBank)
      .where(
        and(
          eq(questionBank.id, id),
          eq(questionBank.createdBy, session.user.id)
        )
      )
      .then(res => res[0]);

    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question not found or access denied' }, { status: 404 });
    }

    // Soft delete (set isActive to false)
    await db
      .update(questionBank)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(questionBank.id, id));

    return NextResponse.json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}