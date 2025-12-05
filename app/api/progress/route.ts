import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/db';
import { userProgress, lessons, subjects, courses } from '@/schema/user.schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '../auth/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const lessonId = searchParams.get('lessonId');

    let progressData;

    if (lessonId) {
      // Get specific lesson progress
      progressData = await db
        .select()
        .from(userProgress)
        .where(
          and(
            eq(userProgress.lessonId, lessonId),
            eq(userProgress.userId, session.user.id)
          )
        )
        .then(res => res[0]);
    } else if (courseId) {
      // Get all progress for a course
      progressData = await db
        .select()
        .from(userProgress)
        .where(
          and(
            eq(userProgress.courseId, courseId),
            eq(userProgress.userId, session.user.id)
          )
        );
    } else {
      // Get all user progress
      progressData = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, session.user.id));
    }

    return NextResponse.json({ progress: progressData });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, courseId, completed, score, timeSpent } = body;

    if (!lessonId || !courseId) {
      return NextResponse.json({ error: 'Lesson ID and Course ID are required' }, { status: 400 });
    }

    // Check if progress already exists
    const existingProgress = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.lessonId, lessonId),
          eq(userProgress.userId, session.user.id)
        )
      )
      .then(res => res[0]);

    let result;

    if (existingProgress) {
      // Update existing progress
      [result] = await db
        .update(userProgress)
        .set({
          completed: completed !== undefined ? completed : existingProgress.completed,
          score: score !== undefined ? score : existingProgress.score,
          timeSpent: timeSpent !== undefined ? timeSpent : existingProgress.timeSpent,
          lastAccessed: new Date(),
        })
        .where(
          and(
            eq(userProgress.lessonId, lessonId),
            eq(userProgress.userId, session.user.id)
          )
        )
        .returning();
    } else {
      // Create new progress
      [result] = await db
        .insert(userProgress)
        .values({
          id: uuidv4(),
          userId: session.user.id,
          lessonId,
          courseId,
          completed: completed || false,
          score: score || null,
          timeSpent: timeSpent || 0,
          lastAccessed: new Date(),
        })
        .returning();
    }

    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully',
      progress: result,
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, completed, score, timeSpent } = body;

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    // Get course ID from lesson
    const lesson = await db
      .select({
        courseId: subjects.courseId
      })
      .from(lessons)
      .innerJoin(subjects, eq(lessons.subjectId, subjects.id))
      .where(eq(lessons.id, lessonId))
      .then(res => res[0]);

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Update or create progress
    const existingProgress = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.lessonId, lessonId),
          eq(userProgress.userId, session.user.id)
        )
      )
      .then(res => res[0]);

    let result;

    if (existingProgress) {
      [result] = await db
        .update(userProgress)
        .set({
          completed: completed !== undefined ? completed : existingProgress.completed,
          score: score !== undefined ? score : existingProgress.score,
          timeSpent: timeSpent !== undefined ? 
            (existingProgress.timeSpent || 0) + timeSpent : 
            existingProgress.timeSpent,
          lastAccessed: new Date(),
        })
        .where(
          and(
            eq(userProgress.lessonId, lessonId),
            eq(userProgress.userId, session.user.id)
          )
        )
        .returning();
    } else {
      [result] = await db
        .insert(userProgress)
        .values({
          id: uuidv4(),
          userId: session.user.id,
          lessonId,
          courseId: lesson.courseId,
          completed: completed || false,
          score: score || null,
          timeSpent: timeSpent || 0,
          lastAccessed: new Date(),
        })
        .returning();
    }

    return NextResponse.json({
      success: true,
      message: 'Progress updated successfully',
      progress: result,
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}