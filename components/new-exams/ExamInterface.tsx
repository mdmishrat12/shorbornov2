// components/exam/ExamInterface.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useExam } from '@/hooks/useExam';
import ExamTimer from './ExamTimer';
import QuestionNavigation from './QuestionNavigation';
import QuestionDisplay from './QuestionDisplay';

interface ExamInterfaceProps {
  examId: string;
  attemptId: string;
}

export default function ExamInterface({ examId, attemptId }: ExamInterfaceProps) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  const {
    exam,
    questions,
    attempt,
    isLoading,
    error,
    saveAnswer,
    submitExam,
    isSubmitting
  } = useExam(examId, attemptId);

  // Load exam data
  useEffect(() => {
    if (exam && questions) {
      const duration = exam.duration * 60; // Convert to seconds
      const elapsed = Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000);
      setTimeRemaining(Math.max(0, duration - elapsed));
    }
  }, [exam, attempt, questions]);

  // Auto-save timer
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (questions && questions[currentQuestion]) {
        const currentAnswer = answers[questions[currentQuestion].id];
        if (currentAnswer) {
          saveAnswer({
            questionPaperItemId: questions[currentQuestion].id,
            selectedOption: currentAnswer.selectedOption,
            isFlagged: currentAnswer.isFlagged,
            timeSpent: currentAnswer.timeSpent
          });
        }
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [currentQuestion, questions, answers, saveAnswer]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((option: string) => {
    if (!questions || !questions[currentQuestion]) return;

    const questionId = questions[currentQuestion].id;
    const currentTime = Date.now();

    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOption: option,
        lastUpdated: currentTime,
        timeSpent: (prev[questionId]?.timeSpent || 0) + 
          (prev[questionId]?.lastUpdated ? 
            (currentTime - prev[questionId].lastUpdated) : 0)
      }
    }));

    // Auto-save immediately
    saveAnswer({
      questionPaperItemId: questionId,
      selectedOption: option,
      isFlagged: answers[questionId]?.isFlagged || false,
      timeSpent: answers[questionId]?.timeSpent || 0
    });
  }, [currentQuestion, questions, answers, saveAnswer]);

  // Handle flag question
  const handleFlagQuestion = useCallback(() => {
    if (!questions || !questions[currentQuestion]) return;

    const questionId = questions[currentQuestion].id;
    const isCurrentlyFlagged = answers[questionId]?.isFlagged || false;

    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        isFlagged: !isCurrentlyFlagged
      }
    }));

    saveAnswer({
      questionPaperItemId: questionId,
      selectedOption: answers[questionId]?.selectedOption || '',
      isFlagged: !isCurrentlyFlagged,
      timeSpent: answers[questionId]?.timeSpent || 0
    });
  }, [currentQuestion, questions, answers, saveAnswer]);

  // Handle exam submission
  const handleSubmitExam = async () => {
    if (window.confirm('Are you sure you want to submit the exam? This action cannot be undone.')) {
      const result = await submitExam();
      if (result.success) {
        router.push(`/exams/${examId}/results/${attemptId}`);
      }
    }
  };

  // Handle time expiry
  const handleTimeExpired = async () => {
    const result = await submitExam();
    if (result.success) {
      router.push(`/exams/${examId}/results/${attemptId}`);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading exam...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>Error loading exam: {error}</p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!exam || !questions) {
    return <div className="text-center p-8">Exam not found</div>;
  }

  const currentQuestionData = questions[currentQuestion];
  const currentAnswer = currentQuestionData ? answers[currentQuestionData.id] : null;

  return (
    <div className="container mx-auto p-4">
      {/* Exam Header */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <p className="text-gray-600">{exam.description}</p>
          </div>
          <div className="text-right">
            <ExamTimer 
              duration={exam.duration}
              startedAt={attempt.startedAt}
              onTimeExpired={handleTimeExpired}
              showTimer={exam.showTimer}
            />
            <div className="mt-2 text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Question Navigation Sidebar */}
        {exam.allowQuestionNavigation && (
          <div className="lg:w-1/4">
            <QuestionNavigation
              questions={questions}
              currentIndex={currentQuestion}
              answers={answers}
              onQuestionSelect={setCurrentQuestion}
              examConfig={exam}
            />
          </div>
        )}

        {/* Main Question Display */}
        <div className="lg:w-3/4">
          {currentQuestionData && (
            <QuestionDisplay
              question={currentQuestionData}
              questionNumber={currentQuestion + 1}
              userAnswer={currentAnswer}
              examConfig={exam}
              onAnswerSelect={handleAnswerSelect}
              onFlagQuestion={handleFlagQuestion}
              onNavigate={(direction) => {
                if (direction === 'prev' && currentQuestion > 0) {
                  setCurrentQuestion(currentQuestion - 1);
                } else if (direction === 'next' && currentQuestion < questions.length - 1) {
                  setCurrentQuestion(currentQuestion + 1);
                }
              }}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            
            <div className="flex gap-4">
              {exam.allowQuestionReview && (
                <button
                  onClick={handleFlagQuestion}
                  className={`px-6 py-2 rounded ${
                    currentAnswer?.isFlagged 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-yellow-200'
                  }`}
                >
                  {currentAnswer?.isFlagged ? 'Unflag' : 'Flag for Review'}
                </button>
              )}
              
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                </button>
              )}
            </div>
          </div>

          {/* Warning Messages */}
          {exam.allowTabSwitch === false && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-bold">Warning:</p>
              <p>Tab switching is not allowed. Multiple tab switches may result in disqualification.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}