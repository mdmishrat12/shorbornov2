import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/db';
import { lessons, subjects, courses, userProgress } from '@/schema/user.schema';
import { eq, and } from 'drizzle-orm';
import { authOptions } from '../../auth/auth';

interface RouteParams {
  params: {
    id: string;
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lessonId = params.id;

    // Get lesson details with subject and course info
    const lesson = await db
      .select({
        lesson: lessons,
        subjectName: subjects.name,
        courseTitle: courses.title,
        courseId: courses.id,
      })
      .from(lessons)
      .innerJoin(subjects, eq(lessons.subjectId, subjects.id))
      .innerJoin(courses, eq(subjects.courseId, courses.id))
      .where(eq(lessons.id, lessonId))
      .then(res => res[0]);

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Get user progress for this lesson
    const progress = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.lessonId, lessonId),
          eq(userProgress.userId, session.user.id)
        )
      )
      .then(res => res[0]);

    return NextResponse.json({
      lesson: {
        ...lesson.lesson,
        subjectName: lesson.subjectName,
        courseTitle: lesson.courseTitle,
        courseId: lesson.courseId,
      },
      progress: progress || null,
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lessonId = params.id;
    const body = await request.json();

    // Check if user owns the course containing this lesson
    const lessonWithCourse = await db
      .select({
        courseUserId: courses.userId,
      })
      .from(lessons)
      .innerJoin(subjects, eq(lessons.subjectId, subjects.id))
      .innerJoin(courses, eq(subjects.courseId, courses.id))
      .where(eq(lessons.id, lessonId))
      .then(res => res[0]);

    if (!lessonWithCourse) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    if (lessonWithCourse.courseUserId !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Update lesson
    const [updatedLesson] = await db
      .update(lessons)
      .set({
        title: body.title,
        content: body.content,
        estimatedMarks: body.estimatedMarks,
        importance: body.importance,
        isPublished: body.isPublished,
      })
      .where(eq(lessons.id, lessonId))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Lesson updated successfully',
      lesson: updatedLesson,
    });
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}