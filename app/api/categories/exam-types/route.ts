// app/api/categories/exam-types/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/db';
import { examTypes } from '@/schema/user.schema';
import { eq } from 'drizzle-orm';
import { authOptions } from '../../auth/auth';
import { randomUUID } from 'crypto'; // Add this import

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Generate ID manually
    const examTypeId = randomUUID();

    // Create the exam type with manual ID
    const [newExamType] = await db
      .insert(examTypes)
      .values({
        id: examTypeId, // Add the ID manually
        name: body.name,
        shortCode: body.shortCode || null,
        description: body.description || null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Exam type created successfully',
      data: newExamType,
    });
  } catch (error) {
    console.error('Error creating exam type:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await db
      .select({
        id: examTypes.id,
        name: examTypes.name,
        shortCode: examTypes.shortCode,
        description: examTypes.description,
      })
      .from(examTypes)
      .where(eq(examTypes.isActive, true))
      .orderBy(examTypes.name);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching exam types:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}