// components/exams/AnswerSheet.tsx
'use client';

import { useState } from 'react';

interface AnswerSheetProps {
  totalQuestions: number;
  answers: Record<number, string>;
  flaggedQuestions: number[];
  currentQuestion: number;
  onQuestionSelect: (questionNumber: number) => void;
  examSettings: {
    allowQuestionNavigation?: boolean;
    showQuestionNumbers?: boolean;
  };
}

export function AnswerSheet({
  totalQuestions,
  answers,
  flaggedQuestions,
  currentQuestion,
  onQuestionSelect,
  examSettings,
}: AnswerSheetProps) {
  const [filter, setFilter] = useState<'all' | 'answered' | 'unanswered' | 'flagged'>('all');
  
  // Calculate statistics
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = flaggedQuestions.length;

  // Get questions based on filter
  const getFilteredQuestions = () => {
    const questions = Array.from({ length: totalQuestions }, (_, i) => i + 1);
    
    switch (filter) {
      case 'answered':
        return questions.filter(q => answers[q]);
      case 'unanswered':
        return questions.filter(q => !answers[q]);
      case 'flagged':
        return questions.filter(q => flaggedQuestions.includes(q));
      default:
        return questions;
    }
  };

  const getQuestionStatus = (questionNumber: number) => {
    if (flaggedQuestions.includes(questionNumber)) return 'flagged';
    if (answers[questionNumber]) return 'answered';
    return 'unanswered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-green-500';
      case 'flagged': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'answered': return 'Answered';
      case 'flagged': return 'Flagged';
      default: return 'Not answered';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Answer Sheet</h3>
        <div className="text-sm text-gray-600">
          {answeredCount}/{totalQuestions} answered
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-2 rounded-lg text-sm ${
            filter === 'all' 
              ? 'bg-blue-100 text-blue-700 border border-blue-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({totalQuestions})
        </button>
        <button
          onClick={() => setFilter('answered')}
          className={`px-3 py-2 rounded-lg text-sm ${
            filter === 'answered'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Answered ({answeredCount})
        </button>
        <button
          onClick={() => setFilter('unanswered')}
          className={`px-3 py-2 rounded-lg text-sm ${
            filter === 'unanswered'
              ? 'bg-red-100 text-red-700 border border-red-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Unanswered ({unansweredCount})
        </button>
        <button
          onClick={() => setFilter('flagged')}
          className={`px-3 py-2 rounded-lg text-sm ${
            filter === 'flagged'
              ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Flagged ({flaggedCount})
        </button>
      </div>

      {/* Question Grid */}
      <div className="border rounded-lg p-4">
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {getFilteredQuestions().map(questionNumber => {
            const status = getQuestionStatus(questionNumber);
            const isCurrent = questionNumber === currentQuestion;
            
            return (
              <button
                key={questionNumber}
                onClick={() => examSettings.allowQuestionNavigation && onQuestionSelect(questionNumber)}
                disabled={!examSettings.allowQuestionNavigation}
                className={`relative w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all ${
                  isCurrent
                    ? 'ring-2 ring-blue-500 ring-offset-1 bg-white'
                    : 'hover:bg-gray-100'
                } ${!examSettings.allowQuestionNavigation ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                title={`Question ${questionNumber}: ${getStatusText(status)}`}
              >
                {/* Status indicator dot */}
                <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${getStatusColor(status)}`} />
                
                {/* Question number */}
                <span className={`${isCurrent ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>
                  {questionNumber}
                </span>
                
                {/* Answer indicator */}
                {answers[questionNumber] && (
                  <div className="absolute -bottom-1 text-xs font-bold text-green-600">
                    {answers[questionNumber]}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Legend</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-600">Flagged</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span className="text-sm text-gray-600">Not answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full ring-2 ring-blue-500 bg-white"></div>
            <span className="text-sm text-gray-600">Current</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Progress Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-blue-700">Total Questions:</span>
            <span className="font-medium">{totalQuestions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-green-700">Answered:</span>
            <span className="font-medium text-green-700">{answeredCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-red-700">Unanswered:</span>
            <span className="font-medium text-red-700">{unansweredCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-yellow-700">Flagged for Review:</span>
            <span className="font-medium text-yellow-700">{flaggedCount}</span>
          </div>
          <div className="pt-2 border-t border-blue-200">
            <div className="flex justify-between font-medium">
              <span className="text-blue-800">Completion:</span>
              <span className="text-blue-800">
                {Math.round((answeredCount / totalQuestions) * 100)}%
              </span>
            </div>
            <div className="mt-1 w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}