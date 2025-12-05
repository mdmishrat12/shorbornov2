// hooks/useExam.ts
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export function useExam(examId: string, attemptId?: string) {
  const { data: session } = useSession();
  const [exam, setExam] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchExamData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!attemptId) {
        // Start new attempt
        const response = await fetch(`/api/exams/${examId}/start`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message);
        }
        
        setAttempt(result.data.attempt);
        attemptId = result.data.attempt.id;
      } else {
        // Get existing attempt
        const response = await fetch(`/api/exams/${examId}/attempt/${attemptId}`);
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.message);
        }
        
        setAttempt(result.data.attempt);
      }
      
      // Get questions
      const questionsResponse = await fetch(
        `/api/exams/${examId}/attempt/${attemptId}/questions`
      );
      const questionsResult = await questionsResponse.json();
      
      if (!questionsResult.success) {
        throw new Error(questionsResult.message);
      }
      
      setExam(questionsResult.data.exam);
      setQuestions(questionsResult.data.questions);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load exam');
    } finally {
      setIsLoading(false);
    }
  }, [examId, attemptId]);

  const saveAnswer = useCallback(async (answerData: any) => {
    try {
      const response = await fetch(
        `/api/exams/${examId}/attempt/${attemptId}/answer`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answerData)
        }
      );
      
      const result = await response.json();
      return result;
    } catch (err) {
      console.error('Error saving answer:', err);
      return { success: false, message: 'Failed to save answer' };
    }
  }, [examId, attemptId]);

  const submitExam = useCallback(async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(
        `/api/exams/${examId}/attempt/${attemptId}/submit`,
        { method: 'POST' }
      );
      
      const result = await response.json();
      return result;
    } catch (err) {
      console.error('Error submitting exam:', err);
      return { success: false, message: 'Failed to submit exam' };
    } finally {
      setIsSubmitting(false);
    }
  }, [examId, attemptId]);

  useEffect(() => {
    if (session?.user?.id && examId) {
      fetchExamData();
    }
  }, [session, examId, fetchExamData]);

  return {
    exam,
    attempt,
    questions,
    isLoading,
    error,
    saveAnswer,
    submitExam,
    isSubmitting,
    refresh: fetchExamData
  };
}