// app/api/categories/topics/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/db';
import { topics, questionBankSubjects } from '@/schema/user.schema';
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

    if (!body.name || !body.subjectId) {
      return NextResponse.json({ error: 'Name and subjectId are required' }, { status: 400 });
    }

    const [newTopic] = await db
      .insert(topics)
      .values({
        id: examSeriesId,
        name: body.name,
        subjectId: body.subjectId,
        description: body.description,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Topic created successfully',
      data: newTopic,
    });
  } catch (error) {
    console.error('Error creating topic:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    
    let query = db
      .select({
        id: topics.id,
        name: topics.name,
        subjectId: topics.subjectId,
      })
      .from(topics)
      .where(eq(topics.isActive, true));

    if (subjectId) {
      query = query.where(eq(topics.subjectId, subjectId));
    }

    const data = await query.orderBy(topics.name);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}