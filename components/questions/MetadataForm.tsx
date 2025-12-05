// components/questions/MetadataForm.tsx

import { QuestionFormData } from "@/types/questions.type";

interface MetadataFormProps {
  formData: QuestionFormData;
  updateFormData: (field: keyof QuestionFormData, value: any) => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function MetadataForm({
  formData,
  updateFormData,
  onPrev,
  onSubmit,
  isSubmitting
}: MetadataFormProps) {
  return (
    <div className="space-y-6">
      {/* Metadata Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Number
          </label>
          <input
            type="number"
            value={formData.questionNumber || ''}
            onChange={(e) => updateFormData('questionNumber', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marks *
          </label>
          <input
            type="number"
            value={formData.marks}
            onChange={(e) => updateFormData('marks', parseInt(e.target.value) || 1)}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Limit (seconds) *
          </label>
          <input
            type="number"
            value={formData.timeLimit}
            onChange={(e) => updateFormData('timeLimit', parseInt(e.target.value) || 60)}
            min="10"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="border rounded-lg p-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.hasImage}
            onChange={(e) => updateFormData('hasImage', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            This question includes an image
          </span>
        </label>

        {formData.hasImage && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => updateFormData('imageUrl', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Provide a direct link to the question image
            </p>
          </div>
        )}
      </div>

      {/* Final Review Section */}
      <div className="bg-green-50 rounded-lg p-4">
        <h4 className="font-medium text-green-800 mb-3">Ready to Submit</h4>
        <div className="space-y-2 text-sm">
          <p>✅ All required fields are completed</p>
          <p>✅ Question and options are properly formatted</p>
          <p>✅ Categories are selected for better organization</p>
          <p>✅ Correct answer is marked</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          Back to Question
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {isSubmitting && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isSubmitting ? 'Submitting...' : 'Submit Question'}</span>
        </button>
      </div>
    </div>
  );
}