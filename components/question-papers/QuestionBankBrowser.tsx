// components/question-papers/QuestionBankBrowser.tsx
'use client';

import { useState, useEffect } from 'react';

interface QuestionBankBrowserProps {
  filters: {
    subjectIds?: string[];
    difficultyLevels?: string[];
    examTypeIds?: string[];
  };
  onQuestionsSelect: (questionIds: string[]) => void;
}

export function QuestionBankBrowser({ filters, onQuestionsSelect }: QuestionBankBrowserProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchQuestions();
  }, [filters, page]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filters.subjectIds?.length && { subjectIds: filters.subjectIds.join(',') }),
        ...(filters.difficultyLevels?.length && { difficultyLevels: filters.difficultyLevels.join(',') }),
      });

      const response = await fetch(`/api/questions?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setQuestions(data.data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (questionId: string) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleAddSelected = () => {
    onQuestionsSelect(selectedQuestions);
    setSelectedQuestions([]);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Browse Question Bank</h3>
        <div className="text-sm text-gray-500">
          {selectedQuestions.length} questions selected
        </div>
      </div>

      {/* Questions List */}
      <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No questions found. Try adjusting your filters.
          </div>
        ) : (
          questions.map((question) => (
            <div
              key={question.id}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedQuestions.includes(question.id) ? 'bg-blue-50' : ''
              }`}
              onClick={() => toggleQuestion(question.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Q{question.questionNumber}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      question.difficultyLevel === 'easy' ? 'bg-green-100 text-green-800' :
                      question.difficultyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      question.difficultyLevel === 'hard' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficultyLevel}
                    </span>
                    <span className="text-xs text-gray-500">
                      {question.marks} mark{question.marks !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-gray-800 line-clamp-2">{question.question}</p>
                </div>
                <div className="ml-4">
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(question.id)}
                    onChange={() => toggleQuestion(question.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setPage(prev => Math.max(1, prev - 1))}
          disabled={page === 1 || loading}
          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <div className="text-sm text-gray-600">Page {page}</div>
        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={loading || questions.length < 20}
          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Add Selected Button */}
      {selectedQuestions.length > 0 && (
        <button
          onClick={handleAddSelected}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add {selectedQuestions.length} Selected Questions to Paper
        </button>
      )}
    </div>
  );
}