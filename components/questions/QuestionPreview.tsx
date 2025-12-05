// components/questions/QuestionPreview.tsx

import { QuestionFormData } from "@/types/questions.type";

interface QuestionPreviewProps {
  formData: QuestionFormData;
}

export function QuestionPreview({ formData }: QuestionPreviewProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      case 'analytical': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Preview</h3>
      
      {/* Categories Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(formData.difficultyLevel)}`}>
          {formData.difficultyLevel}
        </span>
        {formData.marks && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
            {formData.marks} mark{formData.marks > 1 ? 's' : ''}
          </span>
        )}
        {formData.timeLimit && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600">
            {formData.timeLimit}s
          </span>
        )}
      </div>

      {/* Question */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Question:</h4>
        <p className="text-gray-800 bg-gray-50 rounded-lg p-3 min-h-[60px]">
          {formData.question || 'Question will appear here...'}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2 mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Options:</h4>
        {(['A', 'B', 'C', 'D'] as const).map((option) => (
          <div
            key={option}
            className={`p-3 rounded-lg border ${
              formData.correctAnswer === option
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-start space-x-3">
              <span className={`font-medium ${
                formData.correctAnswer === option ? 'text-green-600' : 'text-gray-600'
              }`}>
                {option}.
              </span>
              <span className="text-gray-800 flex-1">
                {formData[`option${option}` as keyof QuestionFormData] || `Option ${option}`}
              </span>
              {formData.correctAnswer === option && (
                <span className="text-green-600 font-medium text-sm">✓ Correct</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Explanation */}
      {formData.explanation && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Explanation:</h4>
          <p className="text-gray-600 bg-blue-50 rounded-lg p-3 text-sm">
            {formData.explanation}
          </p>
        </div>
      )}

      {/* Image Preview */}
      {formData.hasImage && formData.imageUrl && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Image:</h4>
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <span className="text-gray-500 text-sm">Image will be displayed here</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!formData.question && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📝</div>
          <p>Start typing to see preview</p>
        </div>
      )}
    </div>
  );
}