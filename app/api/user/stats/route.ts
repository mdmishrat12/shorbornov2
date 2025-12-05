import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/db';
import { userProgress, courses, lessons, subjects } from '@/schema/user.schema';
import { eq, and, sql, count, sum, avg } from 'drizzle-orm';
import { authOptions } from '../../auth/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get total courses enrolled/created
    const totalCourses = await db
      .select({ count: count() })
      .from(courses)
      .where(eq(courses.userId, userId))
      .then(res => res[0]?.count || 0);

    // Get progress statistics
    const progressStats = await db
      .select({
        totalLessons: count(lessons.id),
        completedLessons: count(userProgress.lessonId),
        totalStudyTime: sum(userProgress.timeSpent),
        averageScore: avg(userProgress.score),
      })
      .from(userProgress)
      .innerJoin(lessons, eq(userProgress.lessonId, lessons.id))
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.completed, true)
        )
      )
      .then(res => res[0]);

    // Get recent activity
    const recentActivity = await db
      .select({
        lessonTitle: lessons.title,
        subjectName: subjects.name,
        courseTitle: courses.title,
        completed: userProgress.completed,
        score: userProgress.score,
        timeSpent: userProgress.timeSpent,
        lastAccessed: userProgress.lastAccessed,
      })
      .from(userProgress)
      .innerJoin(lessons, eq(userProgress.lessonId, lessons.id))
      .innerJoin(subjects, eq(lessons.subjectId, subjects.id))
      .innerJoin(courses, eq(subjects.courseId, courses.id))
      .where(eq(userProgress.userId, userId))
      .orderBy(userProgress.lastAccessed)
      .limit(10);

    // Get course-wise progress
    const courseProgress = await db
      .select({
        courseId: courses.id,
        courseTitle: courses.title,
        totalLessons: sql<number>`COUNT(DISTINCT ${lessons.id})`,
        completedLessons: sql<number>`COUNT(DISTINCT CASE WHEN ${userProgress.completed} = true THEN ${lessons.id} END)`,
      })
      .from(courses)
      .leftJoin(subjects, eq(subjects.courseId, courses.id))
      .leftJoin(lessons, eq(lessons.subjectId, subjects.id))
      .leftJoin(
        userProgress,
        and(
          eq(userProgress.lessonId, lessons.id),
          eq(userProgress.userId, userId)
        )
      )
      .where(eq(courses.userId, userId))
      .groupBy(courses.id, courses.title)
      .then(results => 
        results.map(course => ({
          ...course,
          progress: course.totalLessons > 0 
            ? Math.round((course.completedLessons / course.totalLessons) * 100)
            : 0,
        }))
      );

    const stats = {
      totalCourses,
      totalLessons: progressStats.totalLessons || 0,
      completedLessons: progressStats.completedLessons || 0,
      totalStudyTime: progressStats.totalStudyTime || 0,
      averageScore: progressStats.averageScore ? Math.round(Number(progressStats.averageScore)) : 0,
      courseProgress,
      recentActivity,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}