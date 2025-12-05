// components/study/QuestionCard.tsx
'use client';

import { QuestionFormData } from '@/types/questions.type';
import { useState } from 'react';

interface Question extends QuestionFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  createdBy: string;
  // Add these fields from your database schema
  topic?: any;
  examType?: any;
  subject?: any;
  standard?: any;
}

interface QuestionCardProps {
  question: Question;
  index: number;
  showAnswer: boolean;
  onToggleAnswer: () => void;
}

export function QuestionCard({ question, index, showAnswer, onToggleAnswer }: QuestionCardProps) {
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOptionClick = (option: string) => {
    setUserAnswer(option);
    setIsSubmitted(true);
  };

  const getOptionLetter = (optionIndex: number) => {
    return String.fromCharCode(65 + optionIndex); // A, B, C, D
  };

  const options = [question.optionA, question.optionB, question.optionC, question.optionD];
  const correctAnswerLetter = question.correctAnswer; // Should be 'A', 'B', 'C', or 'D'

  // Helper function to get display names
  const getTopicName = () => {
    return question.topic?.name || 'Unknown Topic';
  };

  const getExamTypeName = () => {
    return question.examType?.name || question.examTypeId || 'Unknown Exam';
  };

  const getSubjectName = () => {
    return question.subject?.name || question.subjectId || 'Unknown Subject';
  };

  const getStandardName = () => {
    return question.standard?.name || question.standardId || '';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {/* Question Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
              Q{index}
            </span>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                question.difficultyLevel === 'easy' ? 'bg-green-100 text-green-800' :
                question.difficultyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                question.difficultyLevel === 'hard' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {question.difficultyLevel}
              </span>
              {getTopicName() && (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  {getTopicName()}
                </span>
              )}
              {getStandardName() && (
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                  {getStandardName()}
                </span>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {question.marks && `${question.marks} mark${question.marks > 1 ? 's' : ''}`}
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-gray-800 leading-relaxed">
          {question.question}
        </h3>
        
        {question.imageUrl && question.hasImage && (
          <div className="mt-4">
            <img
              src={question.imageUrl}
              alt="Question diagram"
              className="max-w-full h-auto rounded-lg border border-gray-300"
            />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="p-6">
        <div className="space-y-3 mb-6">
          {options.map((option, idx) => {
            const optionLetter = getOptionLetter(idx);
            const isCorrect = optionLetter === correctAnswerLetter;
            const isSelected = userAnswer === optionLetter;
            
            let optionStyle = "border-gray-200 hover:border-blue-300";
            let textStyle = "text-gray-700";
            
            if (isSubmitted || showAnswer) {
              if (isCorrect) {
                optionStyle = "border-green-500 bg-green-50";
                textStyle = "text-green-700 font-medium";
              } else if (isSelected && !isCorrect) {
                optionStyle = "border-red-500 bg-red-50";
                textStyle = "text-red-700";
              }
            }

            return (
              <div
                key={idx}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${optionStyle}`}
                onClick={() => !isSubmitted && !showAnswer && handleOptionClick(optionLetter)}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                    (isSubmitted || showAnswer) && isCorrect ? 'bg-green-100 text-green-700' :
                    (isSubmitted || showAnswer) && isSelected ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {optionLetter}
                  </div>
                  <div className={`flex-1 ${textStyle}`}>
                    {option}
                  </div>
                  {(isSubmitted || showAnswer) && isCorrect && (
                    <svg className="w-5 h-5 text-green-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Answer Toggle & Explanation */}
        {showAnswer && question.explanation && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
            <p className="text-blue-700 leading-relaxed">{question.explanation}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            {isSubmitted && !showAnswer && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                userAnswer === correctAnswerLetter
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {userAnswer === correctAnswerLetter ? '✓ Correct!' : '✗ Incorrect'}
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            {!showAnswer && !isSubmitted && (
              <button
                onClick={() => setIsSubmitted(true)}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Submit Answer
              </button>
            )}
            
            <button
              onClick={onToggleAnswer}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showAnswer
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t text-sm text-gray-500 flex justify-between items-center">
        <span>
          {getExamTypeName() && <span>Exam: {getExamTypeName()}</span>}
          {getSubjectName() && <span className="ml-4">Subject: {getSubjectName()}</span>}
        </span>
        <span>
          Added {new Date(question.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}