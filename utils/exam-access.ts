// utils/exam-access.ts
import { db } from '@/db';
import { examRegistrations, exams, examAttempts, examAttemptStatusEnum } from '@/schema/user.schema';
import { and, eq, or, gte, lte, count } from 'drizzle-orm';

export async function canUserStartExam(userId: string, examId: string) {
  const now = new Date();
  
  // Check if exam exists and is active
  const [exam] = await db.select()
    .from(exams)
    .where(
      and(
        eq(exams.id, examId),
        eq(exams.status, 'live'),
        lte(exams.scheduledStart, now),
        gte(exams.scheduledEnd, now)
      )
    )
    .limit(1);

  if (!exam) {
    return {
      canStart: false,
      reason: 'Exam is not currently available'
    };
  }

  // Check registration
  const [registration] = await db.select()
    .from(examRegistrations)
    .where(
      and(
        eq(examRegistrations.examId, examId),
        eq(examRegistrations.userId, userId),
        eq(examRegistrations.status, 'approved')
      )
    )
    .limit(1);

  if (!registration) {
    return {
      canStart: false,
      reason: 'You are not registered for this exam'
    };
  }

  // Check if max attempts reached
  if (exam.maxAttempts > 0) {
    const [attemptCount] = await db.select({ count: count() })
      .from(examAttempts)
      .where(
        and(
          eq(examAttempts.examId, examId),
          eq(examAttempts.userId, userId)
        )
      );

    if (attemptCount.count >= exam.maxAttempts) {
      return {
        canStart: false,
        reason: 'Maximum attempts reached'
      };
    }
  }

  // Check for retake delay
  if (exam.retakeDelay && registration.lastAttemptAt) {
    const lastAttempt = new Date(registration.lastAttemptAt);
    const nextAllowed = new Date(lastAttempt.getTime() + exam.retakeDelay * 60 * 1000);
    
    if (now < nextAllowed) {
      return {
        canStart: false,
        reason: `Retake available after ${nextAllowed.toLocaleString()}`,
        retryAfter: nextAllowed
      };
    }
  }

  // Check for existing in-progress attempt
  const [inProgressAttempt] = await db.select()
    .from(examAttempts)
    .where(
      and(
        eq(examAttempts.examId, examId),
        eq(examAttempts.userId, userId),
        or(
          eq(examAttempts.status, 'not_started'),
          eq(examAttempts.status, 'in_progress')
        )
      )
    )
    .limit(1);

  if (inProgressAttempt) {
    return {
      canStart: true,
      resume: true,
      attemptId: inProgressAttempt.id
    };
  }

  return {
    canStart: true,
    resume: false
  };
}