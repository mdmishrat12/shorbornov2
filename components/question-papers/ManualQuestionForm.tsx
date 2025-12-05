// components/question-papers/ManualQuestionForm.tsx
'use client';

import { useState } from 'react';

interface ManualQuestionFormProps {
  onClose: () => void;
  onSubmit: (question: any) => void;
}

export function ManualQuestionForm({ onClose, onSubmit }: ManualQuestionFormProps) {
  const [question, setQuestion] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A' as 'A' | 'B' | 'C' | 'D',
    explanation: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard' | 'analytical',
    marks: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...question,
      id: Date.now().toString(),
      options: [question.optionA, question.optionB, question.optionC, question.optionD],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Add Manual Question</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text *
              </label>
              <textarea
                value={question.question}
                onChange={(e) => setQuestion({ ...question, question: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Enter the question..."
                required
              />
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['A', 'B', 'C', 'D'].map((option) => (
                <div key={option} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Option {option} *
                  </label>
                  <textarea
                    value={question[`option${option}` as keyof typeof question]}
                    onChange={(e) =>
                      setQuestion({
                        ...question,
                        [`option${option}`]: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder={`Enter option ${option}...`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setQuestion({ ...question, correctAnswer: option as any })
                    }
                    className={`absolute top-0 right-0 mt-8 mr-3 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      question.correctAnswer === option
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                    title="Mark as correct answer"
                  >
                    {question.correctAnswer === option && '✓'}
                  </button>
                </div>
              ))}
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explanation (Optional)
              </label>
              <textarea
                value={question.explanation}
                onChange={(e) => setQuestion({ ...question, explanation: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Explain the correct answer..."
              />
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={question.difficulty}
                  onChange={(e) =>
                    setQuestion({
                      ...question,
                      difficulty: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="analytical">Analytical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marks
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={question.marks}
                  onChange={(e) =>
                    setQuestion({ ...question, marks: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer
                </label>
                <div className="flex space-x-2">
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setQuestion({ ...question, correctAnswer: option as any })
                      }
                      className={`flex-1 py-2 rounded-lg border ${
                        question.correctAnswer === option
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Question
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}