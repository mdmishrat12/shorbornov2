// components/categories/ExamTypeForm.tsx
import { CategoryFormData } from '@/types/category.types';

interface ExamTypeFormProps {
  formData: CategoryFormData;
  updateFormData: (field: keyof CategoryFormData, value: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ExamTypeForm({ formData, updateFormData, onSubmit, isSubmitting }: ExamTypeFormProps) {
  const isFormValid = formData.examTypeName.trim() !== '';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Exam Type</h3>
        <p className="text-gray-600 mb-6">Add exam types like BCS, HSC, SSC, University, etc.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Type Name *
          </label>
          <input
            type="text"
            value={formData.examTypeName}
            onChange={(e) => updateFormData('examTypeName', e.target.value)}
            placeholder="e.g., Bangladesh Civil Service"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Code
          </label>
          <input
            type="text"
            value={formData.examTypeShortCode}
            onChange={(e) => updateFormData('examTypeShortCode', e.target.value)}
            placeholder="e.g., BCS"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.examTypeDescription}
            onChange={(e) => updateFormData('examTypeDescription', e.target.value)}
            placeholder="Brief description of this exam type..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button
          onClick={onSubmit}
          disabled={!isFormValid || isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {isSubmitting && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{isSubmitting ? 'Creating...' : 'Create Exam Type'}</span>
        </button>
      </div>
    </div>
  );
}