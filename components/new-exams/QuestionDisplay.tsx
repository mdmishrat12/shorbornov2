// components/exam/QuestionDisplay.tsx
'use client';

import { useState } from 'react';
import { 
  Check, 
  X, 
  Image as ImageIcon, 
  Clock,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import Image from 'next/image';

interface QuestionDisplayProps {
  question: {
    id: string;
    question: string;
    options: Array<{ option: string; text: string }>;
    marks: number;
    timeLimit?: number;
    hasImage: boolean;
    imageUrl?: string;
    userAnswer?: {
      selectedOption: string;
      isFlagged: boolean;
      isReviewed: boolean;
      timeSpent?: number;
    };
  };
  questionNumber: number;
  userAnswer?: any;
  examConfig: {
    allowAnswerChange: boolean;
    allowQuestionReview: boolean;
    showQuestionNumbers: boolean;
  };
  onAnswerSelect: (option: string) => void;
  onFlagQuestion: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export default function QuestionDisplay({
  question,
  questionNumber,
  userAnswer,
  examConfig,
  onAnswerSelect,
  onFlagQuestion,
  onNavigate
}: QuestionDisplayProps) {
  const [timeSpent, setTimeSpent] = useState(userAnswer?.timeSpent || 0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Timer for individual question
  useState(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getOptionClass = (option: string) => {
    const isSelected = userAnswer?.selectedOption === option;
    
    if (isSelected) {
      return 'bg-blue-100 border-blue-500 text-blue-700';
    }
    
    return 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400';
  };

  const OptionIcon = ({ option, isSelected }: { option: string; isSelected: boolean }) => {
    return (
      <div className={`
        flex items-center justify-center w-8 h-8 rounded-full mr-3
        ${isSelected 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-700'
        }
      `}>
        {option}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Question Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {examConfig.showQuestionNumbers && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                Question {questionNumber}
              </span>
            )}
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {question.marks} mark{question.marks !== 1 ? 's' : ''}
            </span>
            {question.timeLimit && (
              <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                <Clock className="w-3 h-3" />
                {formatTime(question.timeLimit * 60)} limit
              </span>
            )}
          </div>
          
          {/* Time spent on this question */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Clock className="w-4 h-4" />
            <span>Time spent: {formatTime(timeSpent)}</span>
          </div>
        </div>
        
        {/* Flag button */}
        {examConfig.allowQuestionReview && (
          <button
            onClick={onFlagQuestion}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              userAnswer?.isFlagged
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            {userAnswer?.isFlagged ? 'Flagged' : 'Flag for Review'}
          </button>
        )}
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <div className="prose max-w-none">
          <p className="text-lg font-medium">{question.question}</p>
        </div>
        
        {/* Question Image */}
        {question.hasImage && question.imageUrl && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2 text-gray-600">
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm">Question contains an image</span>
            </div>
            <div className="relative w-full h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={question.imageUrl}
                alt="Question image"
                fill
                className="object-contain p-4"
              />
            </div>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option) => {
          const isSelected = userAnswer?.selectedOption === option.option;
          
          return (
            <button
              key={option.option}
              onClick={() => {
                if (examConfig.allowAnswerChange || !userAnswer?.selectedOption) {
                  onAnswerSelect(option.option);
                }
              }}
              disabled={!examConfig.allowAnswerChange && userAnswer?.selectedOption}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all duration-200
                ${getOptionClass(option.option)}
                ${(!examConfig.allowAnswerChange && userAnswer?.selectedOption) 
                  ? 'opacity-90 cursor-not-allowed' 
                  : 'cursor-pointer'
                }
              `}
            >
              <div className="flex items-center">
                <OptionIcon option={option.option} isSelected={isSelected} />
                <div className="flex-1">
                  <div className="font-medium">{option.text}</div>
                </div>
                {isSelected && (
                  <div className="ml-2">
                    <Check className="w-5 h-5 text-blue-600" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation Toggle */}
      <div className="border-t pt-4">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <BookOpen className="w-4 h-4" />
          <span>{showExplanation ? 'Hide' : 'Show'} Explanation</span>
        </button>
        
        {showExplanation && (
          <div className="mt-3 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Explanation</h4>
            <p className="text-gray-700">
              This is the detailed explanation for the question. It helps understand
              why a particular answer is correct and others are not.
            </p>
          </div>
        )}
      </div>

      {/* Navigation Hint */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>
            {!userAnswer?.selectedOption 
              ? 'Select an answer before proceeding.'
              : examConfig.allowAnswerChange
                ? 'You can change your answer anytime before submission.'
                : 'Answers cannot be changed once selected.'
            }
          </span>
        </div>
      </div>
    </div>
  );
}