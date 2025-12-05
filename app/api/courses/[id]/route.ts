import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/db';
import { courses, subjects, lessons, userProgress } from '@/schema/user.schema';
import { eq, and, desc } from 'drizzle-orm';
import { authOptions } from '../../auth/auth';

interface RouteParams {
  params: Promise<{
    id: string;
  }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await the params promise
    const { id } = await params;
    const courseId = id;

    // Get course details
    const course = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .then(res => res[0]);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get subjects for this course
    const courseSubjects = await db
      .select()
      .from(subjects)
      .where(eq(subjects.courseId, courseId))
      .orderBy(subjects.order);

    // Get lessons for each subject and user progress
    const subjectsWithLessons = await Promise.all(
      courseSubjects.map(async (subject) => {
        const subjectLessons = await db
          .select()
          .from(lessons)
          .where(eq(lessons.subjectId, subject.id))
          .orderBy(lessons.order);

        // Get user progress for each lesson
        const lessonsWithProgress = await Promise.all(
          subjectLessons.map(async (lesson) => {
            const progress = await db
              .select()
              .from(userProgress)
              .where(
                and(
                  eq(userProgress.lessonId, lesson.id),
                  eq(userProgress.userId, session.user.id)
                )
              )
              .then(res => res[0]);

            return {
              ...lesson,
              completed: progress?.completed || false,
              score: progress?.score || null,
              timeSpent: progress?.timeSpent || 0,
              lastAccessed: progress?.lastAccessed || null,
            };
          })
        );

        // Calculate subject progress
        const completedLessons = lessonsWithProgress.filter(lesson => lesson.completed).length;
        const subjectProgress = lessonsWithProgress.length > 0 
          ? Math.round((completedLessons / lessonsWithProgress.length) * 100)
          : 0;

        return {
          ...subject,
          lessons: lessonsWithProgress,
          progress: subjectProgress,
          completedLessons,
          totalLessons: lessonsWithProgress.length,
        };
      })
    );

    // Calculate overall course progress
    const totalLessons = subjectsWithLessons.reduce((sum, subject) => sum + subject.totalLessons, 0);
    const completedLessons = subjectsWithLessons.reduce((sum, subject) => sum + subject.completedLessons, 0);
    const courseProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return NextResponse.json({
      course: {
        ...course,
        progress: courseProgress,
        totalLessons,
        completedLessons,
      },
      subjects: subjectsWithLessons,
    });
  } catch (error) {
    console.error('Error fetching course details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await the params promise
    const { id } = await params;
    const courseId = id;
    const body = await request.json();

    // Check if user owns the course
    const existingCourse = await db
      .select()
      .from(courses)
      .where(
        and(
          eq(courses.id, courseId),
          eq(courses.userId, session.user.id)
        )
      )
      .then(res => res[0]);

    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    // Update course
    const [updatedCourse] = await db
      .update(courses)
      .set({
        title: body.title,
        description: body.description,
        category: body.category,
        thumbnail: body.thumbnail,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, courseId))
      .returning();

    return NextResponse.json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await the params promise
    const { id } = await params;
    const courseId = id;

    // Check if user owns the course
    const existingCourse = await db
      .select()
      .from(courses)
      .where(
        and(
          eq(courses.id, courseId),
          eq(courses.userId, session.user.id)
        )
      )
      .then(res => res[0]);

    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found or access denied' }, { status: 404 });
    }

    // Delete course (cascade will delete subjects and lessons)
    await db.delete(courses).where(eq(courses.id, courseId));

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}