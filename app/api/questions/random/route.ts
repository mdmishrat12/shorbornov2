import { NextResponse } from 'next/server';
import { db } from '@/db';
import { questionBank } from '@/schema/user.schema';
import { and, eq, sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.count || body.count < 1) {
      return NextResponse.json({ error: 'count is required and must be greater than 0' }, { status: 400 });
    }

    // Build filters
    const whereConditions = [eq(questionBank.isActive, true)];
    
    if (body.subjectId) whereConditions.push(eq(questionBank.subjectId, body.subjectId));
    if (body.examType) whereConditions.push(eq(questionBank.examType, body.examType));
    if (body.topic) whereConditions.push(eq(questionBank.topic, body.topic));
    if (body.difficultyLevel) whereConditions.push(eq(questionBank.difficultyLevel, body.difficultyLevel));
    if (body.standard) whereConditions.push(eq(questionBank.standard, body.standard));

    // Get random questions
    const randomQuestions = await db
      .select()
      .from(questionBank)
      .where(and(...whereConditions))
      .orderBy(sql`RANDOM()`)
      .limit(body.count);

    if (randomQuestions.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No questions found with the specified criteria' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: randomQuestions,
      count: randomQuestions.length,
    });
  } catch (error) {
    console.error('Error fetching random questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}