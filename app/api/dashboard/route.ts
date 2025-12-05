// app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { 
  examRegistrations, 
  exams, 
  examAttempts, 
  users 
} from '@/schema/user.schema';
import { getServerSession } from 'next-auth';
import { eq, and, gte, lte, count, avg, sql, desc } from 'drizzle-orm';
import { authOptions } from '../auth/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get('range') || 'month';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Get user stats
    const [user] = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // Get exam statistics
    const [registeredCount] = await db.select({ count: count() })
      .from(examRegistrations)
      .where(
        and(
          eq(examRegistrations.userId, userId),
          eq(examRegistrations.status, 'approved')
        )
      );

    const [completedAttempts] = await db.select({ count: count() })
      .from(examAttempts)
      .where(
        and(
          eq(examAttempts.userId, userId),
          eq(examAttempts.status, 'submitted')
        )
      );

    // Get average score
    const [avgScore] = await db.select({ avg: avg(examAttempts.percentage) })
      .from(examAttempts)
      .where(
        and(
          eq(examAttempts.userId, userId),
          eq(examAttempts.status, 'submitted')
        )
      );

    // Get accuracy
    const [accuracyData] = await db
      .select({
        totalCorrect: sql<number>`SUM(${examAttempts.correctAnswers})`,
        totalAttempted: sql<number>`SUM(${examAttempts.attemptedQuestions})`
      })
      .from(examAttempts)
      .where(
        and(
          eq(examAttempts.userId, userId),
          eq(examAttempts.status, 'submitted')
        )
      );

    const accuracy = accuracyData.totalAttempted > 0 
      ? Math.round((accuracyData.totalCorrect / accuracyData.totalAttempted) * 100)
      : 0;

    // Get upcoming exams
    const [upcomingCount] = await db.select({ count: count() })
      .from(examRegistrations)
      .innerJoin(exams, eq(examRegistrations.examId, exams.id))
      .where(
        and(
          eq(examRegistrations.userId, userId),
          eq(examRegistrations.status, 'approved'),
          gte(exams.scheduledStart, now)
        )
      );

    // Get recent attempts
    const recentAttempts = await db
      .select({
        id: examAttempts.id,
        examTitle: exams.title,
        score: examAttempts.finalScore,
        percentage: examAttempts.percentage,
        date: examAttempts.submittedAt,
        result: examAttempts.result
      })
      .from(examAttempts)
      .innerJoin(exams, eq(examAttempts.examId, exams.id))
      .where(
        and(
          eq(examAttempts.userId, userId),
          eq(examAttempts.status, 'submitted')
        )
      )
      .orderBy(desc(examAttempts.submittedAt))
      .limit(5);

    // Calculate rank (simplified - in production you'd want a more efficient query)
    const allUsers = await db
      .select({
        userId: users.id,
        avgScore: avg(examAttempts.percentage)
      })
      .from(users)
      .leftJoin(examAttempts, eq(users.id, examAttempts.userId))
      .groupBy(users.id)
      .orderBy(desc(sql`avg(${examAttempts.percentage})`));

    const userRank = allUsers.findIndex(u => u.userId === userId) + 1;

    // Calculate streak (simplified)
    const streak = user.stats?.streak || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalExams: registeredCount.count,
        completedExams: completedAttempts.count,
        averageScore: Math.round(avgScore.avg || 0),
        accuracy,
        rank: userRank,
        improvement: user.stats?.improvement || 0,
        streak,
        upcomingExams: upcomingCount.count,
        recentAttempts: recentAttempts.map(attempt => ({
          ...attempt,
          date: attempt.date?.toLocaleDateString() || 'N/A'
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}