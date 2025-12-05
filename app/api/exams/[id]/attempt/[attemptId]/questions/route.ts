// app/api/exams/[examId]/attempt/[attemptId]/questions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { examAttempts, exams, questionPapers, questionPaperItems, questionBank, userAnswers } from '@/schema/user.schema';
import { getServerSession } from 'next-auth';
import { eq, and, asc, isNull } from 'drizzle-orm';
import { authOptions } from '@/app/api/auth/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { examId: string; attemptId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { examId, attemptId } = params;
    const userId = session.user.id;

    // Verify attempt ownership
    const [attempt] = await db.select()
      .from(examAttempts)
      .where(
        and(
          eq(examAttempts.id, attemptId),
          eq(examAttempts.examId, examId),
          eq(examAttempts.userId, userId)
        )
      )
      .limit(1);

    if (!attempt) {
      return NextResponse.json(
        { success: false, message: 'Attempt not found' },
        { status: 404 }
      );
    }

    // Get exam details
    const [exam] = await db.select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);

    // Get question paper items with questions
    const questions = await db
      .select({
        item: questionPaperItems,
        question: questionBank
      })
      .from(questionPaperItems)
      .leftJoin(questionBank, eq(questionPaperItems.questionId, questionBank.id))
      .where(eq(questionPaperItems.questionPaperId, exam.questionPaperId))
      .orderBy(asc(questionPaperItems.questionNumber));

    // Get user's existing answers
    const existingAnswers = await db.select()
      .from(userAnswers)
      .where(eq(userAnswers.attemptId, attemptId));

    // Format questions
    const formattedQuestions = questions.map(({ item, question }) => {
      const userAnswer = existingAnswers.find(ans => 
        ans.questionPaperItemId === item.id
      );

      // Apply shuffling if enabled
      let options = [];
      if (question) {
        options = [
          { option: 'A', text: question.optionA },
          { option: 'B', text: question.optionB },
          { option: 'C', text: question.optionC },
          { option: 'D', text: question.optionD }
        ];

        // Shuffle options if enabled
        if (exam.shuffleOptions) {
          const seed = attempt.shuffleSeed || 0;
          options = shuffleArray(options, seed + item.questionNumber);
        }
      }

      return {
        id: item.id,
        questionNumber: item.questionNumber,
        question: item.isCustom ? item.customQuestion : question?.question,
        options: item.isCustom ? [
          { option: 'A', text: item.customOptionA },
          { option: 'B', text: item.customOptionB },
          { option: 'C', text: item.customOptionC },
          { option: 'D', text: item.customOptionD }
        ] : options,
        isCustom: item.isCustom,
        marks: item.marks,
        timeLimit: item.timeLimit,
        hasImage: question?.hasImage || false,
        imageUrl: question?.imageUrl,
        userAnswer: userAnswer ? {
          selectedOption: userAnswer.selectedOption,
          isFlagged: userAnswer.isFlagged,
          isReviewed: userAnswer.isReviewed,
          timeSpent: userAnswer.timeSpent
        } : null
      };
    });

    // Shuffle questions if enabled
    let finalQuestions = formattedQuestions;
    if (exam.shuffleQuestions && attempt.shuffleSeed) {
      finalQuestions = shuffleArray(formattedQuestions, attempt.shuffleSeed);
    }

    return NextResponse.json({
      success: true,
      data: {
        attempt,
        questions: finalQuestions,
        examConfig: {
          showTimer: exam.showTimer,
          allowQuestionNavigation: exam.allowQuestionNavigation,
          allowAnswerChange: exam.allowAnswerChange,
          allowQuestionReview: exam.allowQuestionReview,
          negativeMarking: exam.allowNegativeMarking,
          negativeMarkingPerQuestion: exam.negativeMarkingPerQuestion
        }
      }
    });
  } catch (error) {
    console.error('Error fetching exam questions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// Fisher-Yates shuffle with seed
function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const random = seededRandom(seed);
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return function() {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
}