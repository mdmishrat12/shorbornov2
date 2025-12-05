// app/api/categories/exam-series/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/db';
import { examSeries, examTypes } from '@/schema/user.schema';
import { eq, and } from 'drizzle-orm';
import { authOptions } from '../../auth/auth';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const examSeriesId = randomUUID();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (!body.name || !body.examTypeId) {
      return NextResponse.json({ error: 'Name and examTypeId are required' }, { status: 400 });
    }

    const [newExamSeries] = await db
      .insert(examSeries)
      .values({
        id: examSeriesId,
        name: body.name,
        examTypeId: body.examTypeId,
        fullName: body.fullName,
        year: body.year,
        description: body.description,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Exam series created successfully',
      data: newExamSeries,
    });
  } catch (error) {
    console.error('Error creating exam series:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const examTypeId = searchParams.get('examTypeId');
    
    let query = db
      .select({
        id: examSeries.id,
        name: examSeries.name,
        fullName: examSeries.fullName,
        year: examSeries.year,
        examTypeId: examSeries.examTypeId,
      })
      .from(examSeries)
      .where(eq(examSeries.isActive, true));

    if (examTypeId) {
      query = query.where(eq(examSeries.examTypeId, examTypeId));
    }

    const data = await query.orderBy(examSeries.name);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching exam series:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}