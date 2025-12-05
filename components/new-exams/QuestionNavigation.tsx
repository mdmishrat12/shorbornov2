// components/exam/QuestionNavigation.tsx
'use client';

import { useState } from 'react';
import { CheckCircle, Circle, Flag, Eye, EyeOff } from 'lucide-react';

interface QuestionNavigationProps {
  questions: Array<{
    id: string;
    questionNumber: number;
    userAnswer?: {
      selectedOption: string;
      isFlagged: boolean;
      isReviewed: boolean;
    };
  }>;
  currentIndex: number;
  answers: Record<string, any>;
  onQuestionSelect: (index: number) => void;
  examConfig: {
    showQuestionNumbers: boolean;
    allowQuestionReview: boolean;
    allowQuestionNavigation: boolean;
  };
}

export default function QuestionNavigation({
  questions,
  currentIndex,
  answers,
  onQuestionSelect,
  examConfig
}: QuestionNavigationProps) {
  const [viewMode, setViewMode] = useState<'all' | 'flagged' | 'unanswered' | 'answered'>('all');
  const [showLegend, setShowLegend] = useState(true);

  const getQuestionStatus = (questionId: string) => {
    const answer = answers[questionId];
    if (!answer) return 'unanswered';
    if (answer.selectedOption && answer.selectedOption !== '') return 'answered';
    if (answer.isFlagged) return 'flagged';
    return 'unanswered';
  };

  const filteredQuestions = questions.filter((question) => {
    const status = getQuestionStatus(question.id);
    
    switch (viewMode) {
      case 'flagged':
        return status === 'flagged';
      case 'unanswered':
        return status === 'unanswered';
      case 'answered':
        return status === 'answered';
      default:
        return true;
    }
  });

  const stats = {
    total: questions.length,
    answered: questions.filter(q => {
      const answer = answers[q.id];
      return answer?.selectedOption && answer.selectedOption !== '';
    }).length,
    flagged: questions.filter(q => answers[q.id]?.isFlagged).length,
    unanswered: questions.filter(q => {
      const answer = answers[q.id];
      return !answer?.selectedOption || answer.selectedOption === '';
    }).length,
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'answered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'flagged':
        return <Flag className="w-4 h-4 text-yellow-500" />;
      case 'unanswered':
        return <Circle className="w-4 h-4 text-gray-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!examConfig.allowQuestionNavigation) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2 flex items-center justify-between">
          Question Navigator
          <button 
            onClick={() => setShowLegend(!showLegend)}
            className="text-gray-500 hover:text-gray-700"
            title={showLegend ? 'Hide Legend' : 'Show Legend'}
          >
            {showLegend ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </h3>
        
        {showLegend && (
          <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Answered ({stats.answered})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Flagged ({stats.flagged})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span>Unanswered ({stats.unanswered})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-blue-300"></div>
              <span>Current</span>
            </div>
          </div>
        )}
      </div>

      {/* View Mode Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'answered', 'unanswered', 'flagged'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as any)}
            className={`px-3 py-1 text-sm rounded-full capitalize ${
              viewMode === mode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {mode}
            {mode === 'all' && ` (${stats.total})`}
            {mode === 'answered' && ` (${stats.answered})`}
            {mode === 'unanswered' && ` (${stats.unanswered})`}
            {mode === 'flagged' && ` (${stats.flagged})`}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{Math.round((stats.answered / stats.total) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-green-500 transition-all duration-300"
            style={{ width: `${(stats.answered / stats.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-96 overflow-y-auto p-1">
        {filteredQuestions.map((question, index) => {
          const status = getQuestionStatus(question.id);
          const isCurrent = currentIndex === questions.findIndex(q => q.id === question.id);
          
          return (
            <button
              key={question.id}
              onClick={() => {
                const originalIndex = questions.findIndex(q => q.id === question.id);
                onQuestionSelect(originalIndex);
              }}
              className={`
                relative p-2 rounded-md flex flex-col items-center justify-center
                ${isCurrent ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                ${status === 'answered' ? 'bg-green-50 hover:bg-green-100' : ''}
                ${status === 'flagged' ? 'bg-yellow-50 hover:bg-yellow-100' : ''}
                ${status === 'unanswered' ? 'bg-gray-50 hover:bg-gray-100' : ''}
                transition-colors duration-200
              `}
              title={`Question ${question.questionNumber} - ${status}`}
            >
              <div className="absolute top-1 right-1">
                <StatusIcon status={status} />
              </div>
              <span className="text-sm font-medium">
                {examConfig.showQuestionNumbers ? question.questionNumber : index + 1}
              </span>
              {isCurrent && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation Summary */}
      <div className="mt-4 pt-4 border-t text-sm">
        <div className="flex justify-between">
          <button
            onClick={() => {
              const prevUnanswered = questions.findIndex((q, i) => 
                i < currentIndex && getQuestionStatus(q.id) === 'unanswered'
              );
              if (prevUnanswered !== -1) {
                onQuestionSelect(prevUnanswered);
              }
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Previous Unanswered
          </button>
          <button
            onClick={() => {
              const nextUnanswered = questions.findIndex((q, i) => 
                i > currentIndex && getQuestionStatus(q.id) === 'unanswered'
              );
              if (nextUnanswered !== -1) {
                onQuestionSelect(nextUnanswered);
              }
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            Next Unanswered →
          </button>
        </div>
      </div>
    </div>
  );
}