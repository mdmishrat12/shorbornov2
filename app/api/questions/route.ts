import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/db';
import { questionBank } from '@/schema/user.schema';
import { eq, and, or, like, sql } from 'drizzle-orm';
import { authOptions } from '../auth/auth';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received question data:', body);

    // Validate required fields
    const requiredFields = [
      'question', 
      'optionA', 
      'optionB', 
      'optionC', 
      'optionD', 
      'correctAnswer', 
      'examTypeId', 
      'subjectId',
      'difficultyLevel'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        console.log(`Missing required field: ${field}`);
        return NextResponse.json({ 
          error: `${field} is required`,
          receivedData: body 
        }, { status: 400 });
      }
    }

    // Validate correct answer
    if (!['A', 'B', 'C', 'D'].includes(body.correctAnswer)) {
      return NextResponse.json({ error: 'correctAnswer must be A, B, C, or D' }, { status: 400 });
    }

    // Validate difficulty level
    if (!['easy', 'medium', 'hard', 'analytical'].includes(body.difficultyLevel)) {
      return NextResponse.json({ error: 'Invalid difficulty level' }, { status: 400 });
    }

    // Create question - using correct field names from schema
    const [newQuestion] = await db
      .insert(questionBank)
      .values({
        id: randomUUID(),
        question: body.question,
        optionA: body.optionA,
        optionB: body.optionB,
        optionC: body.optionC,
        optionD: body.optionD,
        correctAnswer: body.correctAnswer,
        explanation: body.explanation || '',
        subjectId: body.subjectId,
        examTypeId: body.examTypeId, // Correct field name from schema
        examSeriesId: body.examSeriesId || null,
        topicId: body.topicId || null, // Correct field name from schema
        difficultyLevel: body.difficultyLevel,
        standardId: body.standardId || null, // Correct field name from schema
        marks: body.marks || 1,
        timeLimit: body.timeLimit || 60,
        hasImage: body.hasImage || false,
        imageUrl: body.imageUrl || '',
        createdBy: session.user.id,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Question created successfully',
      data: newQuestion,
    });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    console.log('API GET Request URL:', url.toString());
    
    // Build filters with safe defaults
    const subjectId = searchParams.get('subjectId') || '';
    const examTypeId = searchParams.get('examTypeId') || '';
    const topicId = searchParams.get('topicId') || '';
    const difficultyLevel = searchParams.get('difficultyLevel') || '';
    const standardId = searchParams.get('standardId') || '';
    const examSeriesId = searchParams.get('examSeriesId') || '';
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive') !== 'false';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('Processed filters:', {
      subjectId, examTypeId, topicId, difficultyLevel, 
      standardId, examSeriesId, search, isActive, limit, offset
    });

    // Build where conditions
    const whereConditions = [];
    
    // Using correct field names from schema
    if (subjectId) {
      whereConditions.push(eq(questionBank.subjectId, subjectId));
    }
    
    if (examTypeId) {
      whereConditions.push(eq(questionBank.examTypeId, examTypeId));
    }
    
    if (topicId) {
      whereConditions.push(eq(questionBank.topicId, topicId));
    }
    
    if (difficultyLevel) {
      whereConditions.push(eq(questionBank.difficultyLevel, difficultyLevel));
    }
    
    if (standardId) {
      whereConditions.push(eq(questionBank.standardId, standardId));
    }
    
    if (examSeriesId) {
      whereConditions.push(eq(questionBank.examSeriesId, examSeriesId));
    }
    
    if (search) {
      const searchTerm = `%${search}%`;
      whereConditions.push(
        or(
          like(questionBank.question, searchTerm),
          like(questionBank.explanation, searchTerm)
        )
      );
    }
    
    // Handle isActive filter
    whereConditions.push(eq(questionBank.isActive, isActive));

    console.log('Where conditions count:', whereConditions.length);

    // Build the query with correct field names
    let query = db
      .select({
        id: questionBank.id,
        question: questionBank.question,
        optionA: questionBank.optionA,
        optionB: questionBank.optionB,
        optionC: questionBank.optionC,
        optionD: questionBank.optionD,
        correctAnswer: questionBank.correctAnswer,
        explanation: questionBank.explanation,
        subjectId: questionBank.subjectId,
        examTypeId: questionBank.examTypeId, // Correct field name
        topicId: questionBank.topicId, // Correct field name
        standardId: questionBank.standardId, // Correct field name
        examSeriesId: questionBank.examSeriesId,
        difficultyLevel: questionBank.difficultyLevel,
        marks: questionBank.marks,
        timeLimit: questionBank.timeLimit,
        hasImage: questionBank.hasImage,
        imageUrl: questionBank.imageUrl,
        createdAt: questionBank.createdAt,
        updatedAt: questionBank.updatedAt,
        isActive: questionBank.isActive,
        createdBy: questionBank.createdBy,
      })
      .from(questionBank);

    // Apply where conditions if any exist
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    // Apply pagination and ordering
    query = query.limit(limit).offset(offset).orderBy(questionBank.createdAt);

    const questions = await query;
    
    console.log(`Fetched ${questions.length} questions`);
    
    // Debug: Show first question structure if exists
    if (questions.length > 0) {
      console.log('First question structure:', {
        id: questions[0].id,
        hasExamTypeId: 'examTypeId' in questions[0],
        hasTopicId: 'topicId' in questions[0],
        hasStandardId: 'standardId' in questions[0],
      });
    }

    // Get total count for pagination
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(questionBank);
    
    if (whereConditions.length > 0) {
      countQuery = countQuery.where(and(...whereConditions));
    }
    
    const totalResult = await countQuery;
    const total = totalResult[0] ? Number(totalResult[0].count) : 0;

    return NextResponse.json({
      success: true,
      data: questions,
      pagination: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Error details:', errorMessage);
    if (errorStack) {
      console.error('Error stack:', errorStack);
    }
    
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      details: errorMessage
    }, { status: 500 });
  }
}