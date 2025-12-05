import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { questionPapers, questionPaperItems, questionBank } from '@/schema/user.schema';
import { eq, and, inArray, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const paperId = params.id;
    const criteria = body.criteria;

    // Get the question paper
    const [paper] = await db
      .select()
      .from(questionPapers)
      .where(eq(questionPapers.id, paperId));

    if (!paper) {
      return NextResponse.json(
        { success: false, message: 'Question paper not found' },
        { status: 404 }
      );
    }

    // Build query for random questions
    let query = db
      .select()
      .from(questionBank)
      .where(eq(questionBank.isActive, true));

    // Apply filters
    if (criteria.subjectIds?.length) {
      query = query.where(inArray(questionBank.subjectId, criteria.subjectIds));
    }

    if (criteria.difficultyLevels?.length) {
      query = query.where(inArray(questionBank.difficultyLevel, criteria.difficultyLevels));
    }

    if (criteria.examTypeIds?.length) {
      query = query.where(inArray(questionBank.examTypeId, criteria.examTypeIds));
    }

    if (criteria.topicIds?.length) {
      query = query.where(inArray(questionBank.topicId, criteria.topicIds));
    }

    // Random ordering with seed for consistency
    const seed = criteria.seed || Math.random();
    query = query.orderBy(sql`RANDOM()`).limit(criteria.totalQuestions);

    const questions = await query;

    // Create question paper items
    const items = questions.map((question, index) => ({
      id: uuidv4(),
      questionPaperId: paperId,
      questionId: question.id,
      isCustom: false,
      marks: criteria.marksPerQuestion || 1,
      questionNumber: index + 1,
    }));

    // Clear existing items
    await db.delete(questionPaperItems).where(eq(questionPaperItems.questionPaperId, paperId));

    // Insert new items
    await db.insert(questionPaperItems).values(items);

    // Update paper status
    await db
      .update(questionPapers)
      .set({
        generationCriteria: criteria,
        updatedAt: new Date(),
        status: 'draft',
      })
      .where(eq(questionPapers.id, paperId));

    return NextResponse.json({
      success: true,
      message: 'Questions generated successfully',
      data: { questions, items },
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}