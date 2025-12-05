// app/api/categories/subjects/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/db';
import { questionBankSubjects } from '@/schema/user.schema';
import { eq } from 'drizzle-orm';
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

    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const [newSubject] = await db
      .insert(questionBankSubjects)
      .values({
        id: examSeriesId,
        name: body.name,
        code: body.code,
        description: body.description,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Subject created successfully',
      data: newSubject,
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const subjectsData = await db
      .select()
      .from(questionBankSubjects)
      .where(eq(questionBankSubjects.isActive, true))
      .orderBy(questionBankSubjects.name);

    return NextResponse.json({
      success: true,
      data: subjectsData,
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}