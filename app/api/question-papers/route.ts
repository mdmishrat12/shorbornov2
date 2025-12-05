import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { questionPapers, questionPaperItems } from '@/schema/user.schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth';

// GET - List question papers
export async function GET(request: NextRequest) {
  try {
    // Get session for authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const createdBy = searchParams.get('createdBy');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = db.select().from(questionPapers);

    // Filter by createdBy if provided, otherwise show user's papers
    if (createdBy) {
      query = query.where(eq(questionPapers.createdBy, createdBy));
    } else {
      // Default to current user's papers
      query = query.where(eq(questionPapers.createdBy, session.user.id));
    }

    if (status) {
      query = query.where(eq(questionPapers.status, status));
    }

    if (search) {
      query = query.where(
        sql`${questionPapers.title} ILIKE ${`%${search}%`} OR ${questionPapers.description} ILIKE ${`%${search}%`}`
      );
    }

    query = query.limit(limit).offset(offset).orderBy(questionPapers.createdAt);

    const papers = await query;
    return NextResponse.json({ success: true, data: papers });
  } catch (error) {
    console.error('Error fetching question papers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch question papers' },
      { status: 500 }
    );
  }
}

// POST - Create question paper
export async function POST(request: NextRequest) {
  try {
    // Get session for authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const userId = session.user.id;
console.log('userid',userId)
    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      );
    }

    // Generate unique code if not provided
    const paperCode = body.code || `PAPER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create question paper
    const [paper] = await db.insert(questionPapers).values({
      id: uuidv4(),
      title: body.title,
      description: body.description,
      code: paperCode,
      creationMethod: body.creationMethod || 'manual',
      sourceType: body.sourceType || 'bank',
      generationCriteria: body.generationCriteria,
      sections: body.sections,
      duration: body.duration || 180,
      totalMarks: body.totalMarks || 100,
      passingScore: body.passingScore || 40,
      shuffleQuestions: body.shuffleQuestions ?? true,
      shuffleOptions: body.shuffleOptions ?? true,
      showExplanation: body.showExplanation ?? false,
      allowReview: body.allowReview ?? true,
      negativeMarking: body.negativeMarking || { enabled: false, perIncorrect: 0.25 },
      resultRelease: body.resultRelease || 'instant',
      resultReleaseAt: body.resultReleaseAt,
      tags: body.tags || [],
      isTemplate: body.isTemplate || false,
      templateId: body.templateId,
      createdBy: userId,
      status: 'draft',
    }).returning();

    // Handle questions based on creation method
    if (body.creationMethod === 'manual' && body.manualQuestions) {
      const items = body.manualQuestions.map((q: any, index: number) => ({
        id: uuidv4(),
        questionPaperId: paper.id,
        isCustom: true,
        customQuestion: q.question,
        customOptionA: q.optionA || q.options?.[0],
        customOptionB: q.optionB || q.options?.[1],
        customOptionC: q.optionC || q.options?.[2],
        customOptionD: q.optionD || q.options?.[3],
        customCorrectAnswer: q.correctAnswer,
        customExplanation: q.explanation,
        customDifficulty: q.difficulty,
        marks: q.marks || 1,
        questionNumber: index + 1,
      }));

      await db.insert(questionPaperItems).values(items);
    }

    return NextResponse.json({
      success: true,
      message: 'Question paper created successfully',
      data: paper,
    });
  } catch (error) {
    console.error('Error creating question paper:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create question paper' },
      { status: 500 }
    );
  }
}