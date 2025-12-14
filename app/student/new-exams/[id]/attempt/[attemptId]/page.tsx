// app/student/new-exams/[id]/attempt/[attemptId]/page.tsx - FIXED
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import {
  Clock,
  CheckCircle,
  Flag,
  ChevronLeft,
  ChevronRight,
  Save,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckSquare,
  Square,
} from 'lucide-react';

interface Question {
  id: string;
  questionPaperItemId: string;
  questionNumber: number;
  question: string;
  options: Array<{ option: string; text: string }>;
  marks: number;
  hasImage: boolean;
  imageUrl?: string;
}

interface Attempt {
  id: string;
  scheduledEndAt: string;
  status: string;
  totalQuestions: number;
}

export default function ExamAttemptPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id: examId, attemptId } = params;

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSaveInterval, setAutoSaveInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
    if (examId && attemptId) {
      fetchAttemptData();
    }
  }, [status, router, examId, attemptId]);

  useEffect(() => {
    if (attempt) {
      const endTime = new Date(attempt.scheduledEndAt).getTime();
      const updateTimer = () => {
        const now = new Date().getTime();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeRemaining(remaining);
        
        // Auto-submit when time runs out
        if (remaining === 0 && attempt.status === 'in_progress') {
          handleSubmitExam();
        }
      };
      
      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      
      return () => clearInterval(timer);
    }
  }, [attempt]);

  useEffect(() => {
    // Auto-save every 30 seconds
    const interval = setInterval(() => {
      if (Object.keys(answers).length > 0) {
        saveCurrentAnswer();
      }
    }, 30000);
    setAutoSaveInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [answers, currentQuestionIndex]);

  const fetchAttemptData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching attempt data:', { examId, attemptId });
      
      // FIXED: Use /attempt/ (singular) not /attempts/ (plural)
      const attemptRes = await fetch(`/api/exams/${examId}/attempt/${attemptId}`);
      
      if (!attemptRes.ok) {
        throw new Error(`Failed to fetch attempt: ${attemptRes.status}`);
      }
      
      const attemptData = await attemptRes.json();
      console.log('Attempt data:', attemptData);
      
      if (attemptData.success) {
        setAttempt(attemptData.data.attempt);
        
        // FIXED: Use /attempt/ (singular) not /attempts/ (plural)
        const questionsRes = await fetch(`/api/exams/${examId}/attempt/${attemptId}/questions`);
        
        if (!questionsRes.ok) {
          throw new Error(`Failed to fetch questions: ${questionsRes.status}`);
        }
        
        const questionsData = await questionsRes.json();
        console.log('Questions data:', questionsData);
        
        if (questionsData.success) {
          setQuestions(questionsData.data.questions);
          
          // Load saved answers
          const answersRes = await fetch(`/api/exams/${examId}/attempt/${attemptId}/answers`);
          
          if (answersRes.ok) {
            const answersData = await answersRes.json();
            
            if (answersData.success && answersData.data) {
              const savedAnswers: Record<string, string> = {};
              answersData.data.forEach((answer: any) => {
                if (answer.questionPaperItemId && answer.selectedOption) {
                  savedAnswers[answer.questionPaperItemId] = answer.selectedOption;
                }
              });
              setAnswers(savedAnswers);
            }
          }
        } else {
          throw new Error(questionsData.message || 'Failed to load questions');
        }
      } else {
        throw new Error(attemptData.message || 'Failed to load attempt');
      }
    } catch (error) {
      console.error('Error fetching attempt data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentAnswer = async () => {
    if (!attempt || !questions[currentQuestionIndex] || saving) return;

    const currentAnswer = answers[questions[currentQuestionIndex]?.questionPaperItemId];
    
    if (!currentAnswer) return; // Don't save if no answer selected

    setSaving(true);
    try {
      // FIXED: Use /attempt/ (singular)
      const response = await fetch(`/api/exams/${examId}/attempt/${attemptId}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionPaperItemId: questions[currentQuestionIndex].questionPaperItemId,
          selectedOption: currentAnswer,
          isFlagged: flaggedQuestions.has(questions[currentQuestionIndex].questionPaperItemId),
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        console.error('Failed to save answer:', data.message);
      }
    } catch (error) {
      console.error('Error saving answer:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAnswerSelect = (option: string) => {
    const questionId = questions[currentQuestionIndex].questionPaperItemId;
    setAnswers(prev => ({
      ...prev,
      [questionId]: option,
    }));
    
    // Auto-save after selection
    setTimeout(() => saveCurrentAnswer(), 500);
  };

  const toggleFlagQuestion = () => {
    const questionId = questions[currentQuestionIndex].questionPaperItemId;
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleQuestionNavigation = (index: number) => {
    // Save current answer before navigating
    if (answers[questions[currentQuestionIndex]?.questionPaperItemId]) {
      saveCurrentAnswer();
    }
    setCurrentQuestionIndex(index);
    setShowSidebar(false);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitExam = async () => {
    if (!confirm('Are you sure you want to submit the exam? You cannot change answers after submission.')) {
      return;
    }

    // Save current answer first
    if (answers[questions[currentQuestionIndex]?.questionPaperItemId]) {
      await saveCurrentAnswer();
    }

    try {
      setLoading(true);
      
      // FIXED: Use /attempt/ (singular)
      const response = await fetch(`/api/exams/${examId}/attempt/${attemptId}/submit`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        alert('Exam submitted successfully!');
        router.push(`/student/new-exams/${examId}/results/${attemptId}`);
      } else {
        alert(data.message || 'Failed to submit exam');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Failed to submit exam');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error || !attempt || !questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Unable to Load Exam</h1>
        <p className="mt-2 text-gray-600">{error || 'Unable to load exam questions.'}</p>
        <button
          onClick={() => router.push(`/student/new-exams/${examId}`)}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Back to Exam
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isFlagged = flaggedQuestions.has(currentQuestion.questionPaperItemId);
  const answeredCount = Object.keys(answers).length;
  const progressPercentage = (answeredCount / questions.length) * 100;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Exam Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 text-gray-600 hover:text-gray-900 lg:hidden"
                >
                  {showSidebar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    Question {currentQuestion.questionNumber} of {questions.length}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {attempt.status === 'in_progress' ? 'In Progress' : 'Reviewing'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Time Display */}
                <div className="flex items-center px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                  <Clock className="w-5 h-5 mr-2 text-red-600" />
                  <span className={`text-lg font-mono font-semibold ${
                    timeRemaining < 300 ? 'text-red-600 animate-pulse' : 'text-gray-900'
                  }`}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                
                {/* Progress */}
                <div className="hidden md:block">
                  <div className="text-sm text-gray-600">
                    {answeredCount} / {questions.length} answered
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                
                {/* Save Indicator */}
                <div className="text-sm text-gray-500">
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Question Area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Question Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                      Question {currentQuestion.questionNumber}
                    </span>
                    <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-50 rounded-full">
                      {currentQuestion.marks} mark{currentQuestion.marks !== 1 ? 's' : ''}
                    </span>
                    {isFlagged && (
                      <span className="px-3 py-1 text-sm font-medium text-yellow-600 bg-yellow-50 rounded-full">
                        <Flag className="inline w-3 h-3 mr-1" />
                        Flagged
                      </span>
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-medium text-gray-900">
                    {currentQuestion.question}
                  </h2>
                </div>
                <button
                  onClick={toggleFlagQuestion}
                  className={`p-2 rounded-full ${
                    isFlagged
                      ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Flag className="w-5 h-5" />
                </button>
              </div>

              {currentQuestion.hasImage && currentQuestion.imageUrl && (
                <div className="mb-6">
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Question illustration"
                    className="max-w-full rounded-lg"
                  />
                </div>
              )}

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion.questionPaperItemId] === opt.option;
                  
                  return (
                    <button
                      key={opt.option}
                      onClick={() => handleAnswerSelect(opt.option)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 mr-4 rounded ${
                          isSelected
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Option {opt.option}</span>
                          <p className="mt-1 text-gray-700">{opt.text}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => handleQuestionNavigation(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={saveCurrentAnswer}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md shadow-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save
                </button>
                
                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmitExam}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={() => handleQuestionNavigation(currentQuestionIndex + 1)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar - Question Navigator */}
      <div className={`fixed inset-y-0 right-0 z-20 w-64 bg-white border-l border-gray-200 shadow-xl transform transition-transform lg:relative lg:transform-none lg:w-80 ${
        showSidebar ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Question Navigator</h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-1 text-gray-400 hover:text-gray-600 lg:hidden"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Click on any question to navigate
            </div>
          </div>

          {/* Progress Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{answeredCount}/{questions.length}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Answered: {answeredCount}</span>
              <span>Flagged: {flaggedQuestions.size}</span>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const isAnswered = answers[question.questionPaperItemId];
                const isFlagged = flaggedQuestions.has(question.questionPaperItemId);
                const isCurrent = index === currentQuestionIndex;
                
                return (
                  <button
                    key={question.id}
                    onClick={() => handleQuestionNavigation(index)}
                    className={`aspect-square flex items-center justify-center rounded-lg border text-sm font-medium transition-colors relative ${
                      isCurrent
                        ? 'border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-500 ring-opacity-50'
                        : isAnswered
                        ? 'border-green-500 bg-green-50 text-green-600'
                        : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
                    } ${isFlagged ? 'ring-2 ring-yellow-500 ring-opacity-50' : ''}`}
                  >
                    {index + 1}
                    {isFlagged && (
                      <Flag className="absolute top-0.5 right-0.5 w-3 h-3 text-yellow-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-50 border border-green-500 rounded" />
                <span className="text-sm text-gray-600">Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-50 border border-gray-300 rounded" />
                <span className="text-sm text-gray-600">Unanswered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border border-yellow-500 rounded ring-2 ring-yellow-500 ring-opacity-50" />
                <span className="text-sm text-gray-600">Flagged</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-50 border border-blue-500 rounded ring-2 ring-blue-500 ring-opacity-50" />
                <span className="text-sm text-gray-600">Current</span>
              </div>
            </div>
            
            <button
              onClick={handleSubmitExam}
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}