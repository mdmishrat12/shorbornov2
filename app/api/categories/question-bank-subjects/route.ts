// app/api/categories/question-bank-subjects/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { questionBankSubjects } from '@/schema/user.schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const subjects = await db
      .select({
        id: questionBankSubjects.id,
        name: questionBankSubjects.name,
        code: questionBankSubjects.code,
        description: questionBankSubjects.description,
      })
      .from(questionBankSubjects)
      .where(eq(questionBankSubjects.isActive, true))
      .orderBy(questionBankSubjects.name);

    return NextResponse.json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    console.error('Error fetching question bank subjects:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Add import at the top