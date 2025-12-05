'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RealTimeExamInterface } from '@/components/take-exams/RealTimeExamInterface';
import { ExamInstructions } from '@/components/take-exams/ExamInstructions';

export default function TakeExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;
  
  const [exam, setExam] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    if (!examId) return;

    const initializeExam = async () => {
      try {
        setLoading(true);
        
        // Check if exam exists and get details
        const examResponse = await fetch(`/api/exams/${examId}`);
        const examResult = await examResponse.json();
        
        if (!examResult.success) {
          throw new Error(examResult.message || 'Failed to load exam');
        }
        
        setExam(examResult.data);
        
        // Start or resume exam attempt
        const attemptResponse = await fetch(`/api/exams/${examId}/start`, {
          method: 'POST',
        });
        
        const attemptResult = await attemptResponse.json();
        
        if (!attemptResult.success) {
          throw new Error(attemptResult.message || 'Failed to start exam');
        }
        
        setAttempt(attemptResult.data.attempt);
        
        // Get questions
        const questionsResponse = await fetch(`/api/exams/${examId}/questions`);
        const questionsResult = await questionsResponse.json();
        
        if (questionsResult.success) {
          setQuestions(questionsResult.data);
        }
        
      } catch (err) {
        console.error('Error initializing exam:', err);
        setError(err instanceof Error ? err.message : 'Failed to start exam');
      } finally {
        setLoading(false);
      }
    };

    initializeExam();
  }, [examId]);

  const handleStartExam = () => {
    setShowInstructions(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (showInstructions && exam) {
    return (
      <ExamInstructions
        exam={exam}
        attempt={attempt}
        onStart={handleStartExam}
      />
    );
  }

  if (exam && attempt && questions.length > 0) {
    return (
      <RealTimeExamInterface
        exam={exam}
        attempt={attempt}
        questions={questions}
      />
    );
  }

  return null;
}