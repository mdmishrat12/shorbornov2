// app/api/exams/accessible/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { exams, examRegistrations, examAttempts } from '@/schema/user.schema';
import { getServerSession } from 'next-auth';
import { eq, and, or, gte, lte, like, sql, desc, asc } from 'drizzle-orm';
import { authOptions } from '../../auth/auth';

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
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const filter = searchParams.get('filter') || 'upcoming'; // upcoming, ongoing, past, all

    // Base query for registered exams
    let query = db
      .select({
        exam: exams,
        registration: examRegistrations,
        lastAttempt: examAttempts,
        attemptsCount: sql<number>`COUNT(${examAttempts.id})`.as('attempts_count')
      })
      .from(examRegistrations)
      .innerJoin(exams, eq(examRegistrations.examId, exams.id))
      .leftJoin(
        examAttempts,
        and(
          eq(examAttempts.examId, exams.id),
          eq(examAttempts.userId, userId),
          eq(examAttempts.status, 'submitted')
        )
      )
      .where(
        and(
          eq(examRegistrations.userId, userId),
          eq(examRegistrations.status, 'approved'),
          eq(exams.status, 'live')
        )
      )
      .groupBy(exams.id, examRegistrations.id, examAttempts.id);

    // Apply filters
    const now = new Date();
    
    if (filter === 'upcoming') {
      query = query.where(gte(exams.scheduledStart, now));
    } else if (filter === 'ongoing') {
      query = query.where(
        and(
          lte(exams.scheduledStart, now),
          gte(exams.scheduledEnd, now)
        )
      );
    } else if (filter === 'past') {
      query = query.where(lte(exams.scheduledEnd, now));
    }

    if (status) {
      query = query.where(eq(exams.status, status));
    }

    if (search) {
      query = query.where(
        or(
          like(exams.title, `%${search}%`),
          like(exams.description, `%${search}%`),
          like(exams.code, `%${search}%`)
        )
      );
    }

    // Order by schedule
    query = query
      .orderBy(asc(exams.scheduledStart))
      .limit(limit)
      .offset(offset);

    const accessibleExams = await query;

    // Transform response
    const examsWithAccess = accessibleExams.map(item => ({
      ...item.exam,
      registration: {
        id: item.registration.id,
        status: item.registration.status,
        registeredAt: item.registration.registeredAt
      },
      lastAttempt: item.lastAttempt || null,
      attemptsCount: item.attemptsCount,
      canStart: filter === 'ongoing' || (filter === 'upcoming' && 
        new Date(item.exam.scheduledStart) <= new Date(now.getTime() + 15 * 60000)) // 15 minutes before start
    }));

    // Count total
    const [totalResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(examRegistrations)
      .innerJoin(exams, eq(examRegistrations.examId, exams.id))
      .where(
        and(
          eq(examRegistrations.userId, userId),
          eq(examRegistrations.status, 'approved'),
          eq(exams.status, 'live')
        )
      );

    return NextResponse.json({
      success: true,
      data: examsWithAccess,
      pagination: {
        limit,
        offset,
        total: totalResult.count,
        filter
      }
    });
  } catch (error) {
    console.error('Error fetching accessible exams:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch exams' },
      { status: 500 }
    );
  }
}