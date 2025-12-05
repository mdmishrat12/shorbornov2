// components/question-papers/PaperPreview.tsx
'use client';

import { QuestionPaperFormData } from '@/types/question-paper.type';

interface PaperPreviewProps {
  formData: QuestionPaperFormData;
  manualQuestions: any[];
}

export function PaperPreview({ formData, manualQuestions }: PaperPreviewProps) {
  const getQuestionCount = () => {
    if (formData.creationMethod === 'manual') {
      return manualQuestions.length;
    } else if (formData.creationMethod === 'random') {
      return formData.generationCriteria?.totalQuestions || 0;
    }
    return 0;
  };

  const getDifficultyBreakdown = () => {
    if (formData.creationMethod === 'manual') {
      const breakdown = { easy: 0, medium: 0, hard: 0, analytical: 0 };
      manualQuestions.forEach((q) => {
        breakdown[q.difficulty]++;
      });
      return breakdown;
    } else if (formData.creationMethod === 'random') {
      return formData.generationCriteria?.questionsPerDifficulty || {
        easy: 0, medium: 0, hard: 0, analytical: 0
      };
    }
    return { easy: 0, medium: 0, hard: 0, analytical: 0 };
  };

  const difficultyBreakdown = getDifficultyBreakdown();
  const totalQuestions = getQuestionCount();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Paper Preview</h2>

      {/* Paper Header */}
      <div className="border-b pb-4 mb-4">
        <h3 className="font-bold text-gray-800 text-lg">{formData.title || 'Untitled Paper'}</h3>
        {formData.description && (
          <p className="text-gray-600 text-sm mt-1">{formData.description}</p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
          <div className="text-xs text-blue-700">Total Questions</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{formData.totalMarks}</div>
          <div className="text-xs text-green-700">Total Marks</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{formData.duration}</div>
          <div className="text-xs text-purple-700">Minutes</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{formData.passingScore}%</div>
          <div className="text-xs text-orange-700">Passing</div>
        </div>
      </div>

      {/* Creation Method */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Creation Method</h4>
        <div className={`px-3 py-2 rounded-lg ${
          formData.creationMethod === 'manual' ? 'bg-blue-100 text-blue-800' :
          formData.creationMethod === 'random' ? 'bg-green-100 text-green-800' :
          formData.creationMethod === 'mixed' ? 'bg-purple-100 text-purple-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {formData.creationMethod?.charAt(0).toUpperCase() + formData.creationMethod?.slice(1)}
        </div>
      </div>

      {/* Difficulty Distribution */}
      {totalQuestions > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Difficulty Distribution</h4>
          <div className="space-y-2">
            {[
              { level: 'easy', label: 'Easy', color: 'bg-green-500' },
              { level: 'medium', label: 'Medium', color: 'bg-yellow-500' },
              { level: 'hard', label: 'Hard', color: 'bg-orange-500' },
              { level: 'analytical', label: 'Analytical', color: 'bg-red-500' },
            ].map(({ level, label, color }) => (
              <div key={level}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-medium">
                    {difficultyBreakdown[level as keyof typeof difficultyBreakdown] || 0}
                    <span className="text-gray-400 ml-1">
                      ({Math.round((difficultyBreakdown[level as keyof typeof difficultyBreakdown] / totalQuestions) * 100 || 0)}%)
                    </span>
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-300`}
                    style={{
                      width: `${(difficultyBreakdown[level as keyof typeof difficultyBreakdown] / totalQuestions) * 100 || 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Summary */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Settings</h4>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Question Shuffling:</span>
            <span className={`font-medium ${formData.shuffleQuestions ? 'text-green-600' : 'text-gray-400'}`}>
              {formData.shuffleQuestions ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Option Shuffling:</span>
            <span className={`font-medium ${formData.shuffleOptions ? 'text-green-600' : 'text-gray-400'}`}>
              {formData.shuffleOptions ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Negative Marking:</span>
            <span className={`font-medium ${formData.negativeMarking.enabled ? 'text-red-600' : 'text-gray-400'}`}>
              {formData.negativeMarking.enabled ? `-${formData.negativeMarking.perIncorrect}` : 'Disabled'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Result Release:</span>
            <span className="font-medium">
              {formData.resultRelease === 'instant' ? 'Instant' :
               formData.resultRelease === 'scheduled' ? 'Scheduled' : 'Manual'}
            </span>
          </div>
        </div>
      </div>

      {/* Manual Questions Preview */}
      {formData.creationMethod === 'manual' && manualQuestions.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium text-gray-700 mb-3">Questions Preview</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {manualQuestions.slice(0, 5).map((q, index) => (
              <div key={q.id} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm">Q{index + 1}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    q.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    q.difficulty === 'hard' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {q.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {q.question}
                </p>
                <div className="text-xs text-gray-500 mt-2">
                  Marks: {q.marks} • Correct: {q.correctAnswer}
                </div>
              </div>
            ))}
            {manualQuestions.length > 5 && (
              <div className="text-center text-sm text-gray-500">
                +{manualQuestions.length - 5} more questions
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Indicator */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
            Draft
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          This preview updates in real-time as you make changes
        </div>
      </div>
    </div>
  );
}