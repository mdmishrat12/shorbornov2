// components/exams/QuestionDisplay.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

interface QuestionDisplayProps {
  question: any;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onFlagToggle: () => void;
  isFlagged: boolean;
  examSettings: {
    showTimer?: boolean;
    allowAnswerChange?: boolean;
    showExplanation?: boolean;
    shuffleOptions?: boolean;
  };
}

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onFlagToggle,
  isFlagged,
  examSettings,
}: QuestionDisplayProps) {
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const firstRenderRef = useRef(true);

  // Get options from question
  const getOptions = () => {
    if (question.isCustom) {
      return [
        question.customOptionA,
        question.customOptionB,
        question.customOptionC,
        question.customOptionD,
      ].filter(Boolean);
    } else {
      return [
        question.optionA,
        question.optionB,
        question.optionC,
        question.optionD,
      ].filter(Boolean);
    }
  };

  // Shuffle options if enabled
  useEffect(() => {
    const options = getOptions();
    if (examSettings.shuffleOptions && !firstRenderRef.current) {
      const shuffled = [...options].sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
    } else {
      setShuffledOptions(options);
    }
    firstRenderRef.current = false;
  }, [question.id, examSettings.shuffleOptions]);

  // Start timer for this question
  useEffect(() => {
    setTimeSpent(0);
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [question.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  const getOriginalOptionIndex = (option: string) => {
    const options = getOptions();
    return options.indexOf(option);
  };

  const getOriginalOptionLabel = (option: string) => {
    const index = getOriginalOptionIndex(option);
    return getOptionLabel(index);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'analytical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const difficulty = question.difficultyLevel || question.customDifficulty || 'medium';

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-800">
              Question {questionNumber} of {totalQuestions}
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </span>
            {question.marks && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {question.marks} mark{question.marks !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {examSettings.showTimer && (
            <p className="text-sm text-gray-600 mt-1">
              Time spent on this question: {formatTime(timeSpent)}
            </p>
          )}
        </div>
        
        <button
          onClick={onFlagToggle}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
            isFlagged
              ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
              : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span>{isFlagged ? '★' : '☆'}</span>
          <span>{isFlagged ? 'Flagged' : 'Flag Question'}</span>
        </button>
      </div>

      {/* Question Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="prose max-w-none">
          <div className="text-lg font-medium text-gray-800 mb-4">
            {question.question || question.customQuestion}
          </div>

          {/* Image if exists */}
          {question.imageUrl && (
            <div className="my-4">
              <img 
                src={question.imageUrl} 
                alt="Question illustration"
                className="max-w-full h-auto rounded-lg border border-gray-300"
              />
            </div>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Select your answer:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {shuffledOptions.map((option, index) => {
            const optionLabel = getOptionLabel(index);
            const originalLabel = getOriginalOptionLabel(option);
            const isSelected = selectedAnswer === originalLabel;
            
            return (
              <button
                key={index}
                onClick={() => onAnswerSelect(originalLabel)}
                disabled={!examSettings.allowAnswerChange && selectedAnswer !== null}
                className={`p-4 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                    : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                } ${!examSettings.allowAnswerChange && selectedAnswer !== null && !isSelected ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {optionLabel}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{option}</div>
                    {isSelected && (
                      <div className="mt-2 text-sm text-green-600 font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Selected
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation (if available and allowed) */}
      {examSettings.showExplanation && question.explanation && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Explanation:</h4>
          <p className="text-green-700">{question.explanation}</p>
        </div>
      )}

      {/* Question Navigation Tips */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-medium text-gray-700">Keyboard Shortcuts</div>
            <div className="text-gray-600">1-4: Select option</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">Navigation</div>
            <div className="text-gray-600">← → : Prev/Next</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">Flag</div>
            <div className="text-gray-600">F: Toggle flag</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">Save</div>
            <div className="text-gray-600">Auto-saves every 30s</div>
          </div>
        </div>
      </div>
    </div>
  );
}