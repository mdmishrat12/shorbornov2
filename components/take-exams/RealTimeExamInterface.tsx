// components/exams/RealTimeExamInterface.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ExamTimer } from './ExamTimer';
import { ExamProgress } from './ExamProgress';
import { AnswerSheet } from './AnswerSheet';
import { QuestionDisplay } from './QuestionDisplay';

interface RealTimeExamInterfaceProps {
  exam: any;
  attempt: any;
  questions: any[];
}

export function RealTimeExamInterface({ exam, attempt, questions }: RealTimeExamInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');
  const router = useRouter();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize answers from localStorage or server
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`exam_${attempt.id}_answers`);
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (error) {
        console.error('Error loading saved answers:', error);
      }
    }

    const savedFlagged = localStorage.getItem(`exam_${attempt.id}_flagged`);
    if (savedFlagged) {
      try {
        setFlaggedQuestions(JSON.parse(savedFlagged));
      } catch (error) {
        console.error('Error loading flagged questions:', error);
      }
    }

    // Setup WebSocket for real-time updates
    setupWebSocket();
    
    // Setup auto-save listener
    const handleAutoSave = () => saveAllAnswers();
    window.addEventListener('saveAllAnswers', handleAutoSave);

    // Setup beforeunload warning
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(answers).length > 0) {
        e.preventDefault();
        e.returnValue = 'You have unsaved answers. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Setup visibility change handler
    const handleVisibilityChange = () => {
      if (document.hidden && !exam.allowTabSwitch) {
        // Log tab switch for proctoring
        logTabSwitch();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('saveAllAnswers', handleAutoSave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [attempt.id, exam.allowTabSwitch]);

  const setupWebSocket = () => {
    if (typeof window === 'undefined') return;

    const ws = new WebSocket(`ws://localhost:3001/ws/exam/${attempt.id}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('connected');
      
      // Send heartbeat every 30 seconds
      setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));
        }
      }, 30000);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'time_update':
          // Handle server time sync
          break;
        case 'announcement':
          // Show exam announcements
          showAnnouncement(data.message);
          break;
        case 'force_submit':
          // Force submit from invigilator
          handleForceSubmit();
          break;
        case 'warning':
          // Show proctoring warning
          showWarning(data.message);
          break;
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');
      
      // Try to reconnect after 5 seconds
      setTimeout(setupWebSocket, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const saveAnswer = useCallback(async (questionNumber: number, answer: string) => {
    // Update local state immediately
    setAnswers(prev => ({ ...prev, [questionNumber]: answer }));
    setSaveStatus('saving');

    // Save to localStorage
    localStorage.setItem(`exam_${attempt.id}_answers`, JSON.stringify({
      ...answers,
      [questionNumber]: answer
    }));

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce server save
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/exams/${exam.id}/attempt/${attempt.id}/answer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            questionNumber,
            answer,
            timestamp: new Date().toISOString(),
          }),
        });

        if (response.ok) {
          setSaveStatus('saved');
        } else {
          setSaveStatus('error');
          console.error('Failed to save answer');
        }
      } catch (error) {
        setSaveStatus('error');
        console.error('Error saving answer:', error);
      }
    }, 1000); // 1 second debounce
  }, [attempt.id, exam.id, answers]);

  const saveAllAnswers = useCallback(async () => {
    if (Object.keys(answers).length === 0) return;

    setSaveStatus('saving');
    
    try {
      const response = await fetch(`/api/exams/${exam.id}/attempt/${attempt.id}/answers/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionNumber, answer]) => ({
            questionNumber: parseInt(questionNumber),
            answer,
          })),
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSaveStatus('saved');
        console.log('All answers saved');
      } else {
        setSaveStatus('error');
        console.error('Failed to save all answers');
      }
    } catch (error) {
      setSaveStatus('error');
      console.error('Error saving all answers:', error);
    }
  }, [exam.id, attempt.id, answers]);

  const toggleFlagQuestion = useCallback((questionNumber: number) => {
    setFlaggedQuestions(prev => {
      const newFlagged = prev.includes(questionNumber)
        ? prev.filter(q => q !== questionNumber)
        : [...prev, questionNumber];
      
      localStorage.setItem(`exam_${attempt.id}_flagged`, JSON.stringify(newFlagged));
      return newFlagged;
    });
  }, [attempt.id]);

  const logTabSwitch = useCallback(async () => {
    if (!exam.enableProctoring) return;

    try {
      await fetch(`/api/exams/${exam.id}/attempt/${attempt.id}/proctoring`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'tab_switch',
          timestamp: new Date().toISOString(),
          severity: exam.maxTabSwitches > 0 ? 'high' : 'medium',
        }),
      });

      // Check if max tab switches exceeded
      if (exam.maxTabSwitches > 0) {
        const response = await fetch(`/api/exams/${exam.id}/attempt/${attempt.id}/tab-switches`);
        const data = await response.json();
        
        if (data.count >= exam.maxTabSwitches) {
          showWarning('Maximum tab switches exceeded. Exam may be disqualified.');
        }
      }
    } catch (error) {
      console.error('Error logging tab switch:', error);
    }
  }, [exam.id, attempt.id, exam.enableProctoring, exam.maxTabSwitches]);

  const showAnnouncement = (message: string) => {
    // Show announcement modal or toast
    alert(`Announcement: ${message}`);
  };

  const showWarning = (message: string) => {
    // Show warning modal
    alert(`⚠️ Warning: ${message}`);
  };

  const handleForceSubmit = async () => {
    if (window.confirm('Invigilator has forced submission. Your exam will be submitted now.')) {
      await submitExam();
    }
  };

  const submitExam = async () => {
    setIsLoading(true);
    
    try {
      // Save all answers first
      await saveAllAnswers();
      
      const response = await fetch(`/api/exams/${exam.id}/attempt/${attempt.id}/submit`, {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Clear local storage
        localStorage.removeItem(`exam_${attempt.id}_answers`);
        localStorage.removeItem(`exam_${attempt.id}_flagged`);
        
        // Redirect based on result settings
        if (exam.showResultImmediately) {
          router.push(`/exams/${exam.id}/results/${attempt.id}`);
        } else {
          router.push(`/exams/${exam.id}/submitted`);
        }
      } else {
        alert(`Submission failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Failed to submit exam. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestionData = questions.find(q => q.questionNumber === currentQuestion);
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{exam.title}</h1>
              <p className="text-sm text-gray-600">Exam Code: {exam.code}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm ${
                connectionStatus === 'connected' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {connectionStatus === 'connected' ? '🟢 Online' : '🔴 Offline'}
              </div>
              
              <div className={`px-3 py-1 rounded-full text-sm ${
                saveStatus === 'saved' ? 'bg-green-100 text-green-800' :
                saveStatus === 'saving' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {saveStatus === 'saved' ? '✓ Saved' :
                 saveStatus === 'saving' ? '⏳ Saving...' :
                 '✗ Error'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Progress & Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
              <ExamProgress
                totalQuestions={totalQuestions}
                answeredQuestions={answeredQuestions}
                flaggedQuestions={flaggedQuestions}
                currentQuestion={currentQuestion}
              />
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <AnswerSheet
                totalQuestions={totalQuestions}
                answers={answers}
                flaggedQuestions={flaggedQuestions}
                currentQuestion={currentQuestion}
                onQuestionSelect={setCurrentQuestion}
                examSettings={exam}
              />
            </div>
          </div>

          {/* Main Content - Question Display */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {currentQuestionData ? (
                <QuestionDisplay
                  question={currentQuestionData}
                  questionNumber={currentQuestion}
                  totalQuestions={totalQuestions}
                  selectedAnswer={answers[currentQuestion]}
                  onAnswerSelect={(answer:any) => saveAnswer(currentQuestion, answer)}
                  onFlagToggle={() => toggleFlagQuestion(currentQuestion)}
                  isFlagged={flaggedQuestions.includes(currentQuestion)}
                  examSettings={exam}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Question not found</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={() => setCurrentQuestion(prev => Math.max(1, prev - 1))}
                  disabled={currentQuestion === 1 || !exam.allowQuestionNavigation}
                  className={`px-6 py-3 rounded-lg ${
                    currentQuestion === 1 || !exam.allowQuestionNavigation
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ← Previous
                </button>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleFlagQuestion(currentQuestion)}
                    className={`px-4 py-2 rounded-lg border ${
                      flaggedQuestions.includes(currentQuestion)
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                  >
                    {flaggedQuestions.includes(currentQuestion) ? 'Unflag' : 'Flag'} Question
                  </button>
                  
                  {exam.allowQuestionReview && (
                    <button
                      onClick={() => {
                        // Mark for review
                        setFlaggedQuestions(prev => [...prev, currentQuestion]);
                        alert('Question marked for review');
                      }}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg border border-blue-300"
                    >
                      Mark for Review
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(totalQuestions, prev + 1))}
                  disabled={currentQuestion === totalQuestions || !exam.allowQuestionNavigation}
                  className={`px-6 py-3 rounded-lg ${
                    currentQuestion === totalQuestions || !exam.allowQuestionNavigation
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Timer */}
      <ExamTimer
        examId={exam.id}
        attemptId={attempt.id}
        scheduledEndAt={new Date(attempt.scheduledEndAt)}
        duration={exam.duration}
        onAutoSubmit={submitExam}
      />

      {/* Submit Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={submitExam}
          disabled={isLoading}
          className={`px-8 py-3 rounded-lg font-medium shadow-lg ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          } text-white`}
        >
          {isLoading ? 'Submitting...' : 'Submit Exam'}
        </button>
      </div>
    </div>
  );
}