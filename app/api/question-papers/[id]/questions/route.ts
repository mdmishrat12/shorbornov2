// For adding/removing questions from paper
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { questionPaperItems } from '@/schema/user.schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paperId = params.id;
    const body = await request.json();
    
    // Add questions to paper
    const items = body.questionIds.map((questionId: string, index: number) => ({
      id: uuidv4(),
      questionPaperId: paperId,
      questionId,
      isCustom: false,
      marks: body.marks || 1,
      questionNumber: body.startNumber + index,
    }));

    await db.insert(questionPaperItems).values(items);
    
    return NextResponse.json({
      success: true,
      message: 'Questions added successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to add questions' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paperId = params.id;
    const { questionIds } = await request.json();
    
    await db.delete(questionPaperItems)
      .where(eq(questionPaperItems.questionPaperId, paperId))
      .where(eq(questionPaperItems.questionId, questionIds));
    
    return NextResponse.json({
      success: true,
      message: 'Questions removed successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to remove questions' },
      { status: 500 }
    );
  }
}