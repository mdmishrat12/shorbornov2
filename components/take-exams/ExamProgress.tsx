// components/exams/ExamProgress.tsx
'use client';

import { useState, useEffect } from 'react';

interface ExamProgressProps {
  totalQuestions: number;
  answeredQuestions: number;
  flaggedQuestions: number[];
  currentQuestion: number;
  timeRemaining?: number; // in seconds
  onTimeUpdate?: (time: number) => void;
}

export function ExamProgress({
  totalQuestions,
  answeredQuestions,
  flaggedQuestions,
  currentQuestion,
  timeRemaining,
  onTimeUpdate,
}: ExamProgressProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Format time helper
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    if (isPaused || !timeRemaining) return;

    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        onTimeUpdate?.(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, timeRemaining, onTimeUpdate]);

  // Calculate progress percentages
  const answeredPercentage = (answeredQuestions / totalQuestions) * 100;
  const flaggedPercentage = (flaggedQuestions.length / totalQuestions) * 100;
  const currentPercentage = (currentQuestion / totalQuestions) * 100;

  // Get time status
  const getTimeStatus = () => {
    if (!timeRemaining) return 'normal';
    
    const remainingTime = timeRemaining - timeElapsed;
    const totalTime = timeRemaining;
    const percentageLeft = (remainingTime / totalTime) * 100;
    
    if (percentageLeft <= 10) return 'critical';
    if (percentageLeft <= 25) return 'warning';
    return 'normal';
  };

  const timeStatus = getTimeStatus();
  
  const getTimeStatusColor = () => {
    switch (timeStatus) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getTimeStatusIcon = () => {
    switch (timeStatus) {
      case 'critical': return '⏰';
      case 'warning': return '⚠️';
      default: return '⏱️';
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress Bars */}
      <div className="space-y-3">
        {/* Overall Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{Math.round(answeredPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${answeredPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Current Question Position */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Current Position</span>
            <span className="font-medium">Q{currentQuestion}/{totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${currentPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Flagged Questions */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Flagged for Review</span>
            <span className="font-medium text-yellow-700">{flaggedQuestions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${flaggedPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Time Tracking */}
      {timeRemaining && (
        <div className={`border rounded-lg p-4 ${getTimeStatusColor()}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{getTimeStatusIcon()}</span>
              <h4 className="font-medium">Time Tracking</h4>
            </div>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-sm px-3 py-1 rounded border bg-white hover:bg-gray-50"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Time Elapsed:</span>
              <span className="font-mono font-medium">{formatTime(timeElapsed)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Time Remaining:</span>
              <span className={`font-mono font-medium ${
                timeStatus === 'critical' ? 'text-red-700' : 
                timeStatus === 'warning' ? 'text-orange-700' : ''
              }`}>
                {formatTime(Math.max(0, timeRemaining - timeElapsed))}
              </span>
            </div>
            <div className="pt-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Time Progress</span>
                <span>{Math.round((timeElapsed / timeRemaining) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    timeStatus === 'critical' ? 'bg-red-500' :
                    timeStatus === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${(timeElapsed / timeRemaining) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{answeredQuestions}</div>
          <div className="text-sm text-gray-600">Answered</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-600">{totalQuestions - answeredQuestions}</div>
          <div className="text-sm text-gray-600">Remaining</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-600">{flaggedQuestions.length}</div>
          <div className="text-sm text-gray-600">Flagged</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{currentQuestion}</div>
          <div className="text-sm text-gray-600">Current</div>
        </div>
      </div>

      {/* Estimated Completion */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Estimated Completion</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Based on current pace:</span>
            <span className="font-medium">
              {answeredQuestions > 0 
                ? `${Math.round((totalQuestions - answeredQuestions) * (timeElapsed / answeredQuestions) / 60)} minutes`
                : 'Calculating...'
              }
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Questions per hour:</span>
            <span className="font-medium">
              {timeElapsed > 0 
                ? Math.round((answeredQuestions / timeElapsed) * 3600)
                : 0
              }
            </span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-800 mb-2">Quick Tips</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Flag difficult questions and return later</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Answer all questions - no penalty for guessing</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Review flagged questions before submitting</span>
          </li>
          {timeStatus === 'warning' && (
            <li className="flex items-start">
              <span className="mr-2">⚠️</span>
              <span className="font-medium">Time is running low! Focus on unanswered questions</span>
            </li>
          )}
          {timeStatus === 'critical' && (
            <li className="flex items-start">
              <span className="mr-2">🚨</span>
              <span className="font-medium">Finish quickly! Exam will auto-submit soon</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}