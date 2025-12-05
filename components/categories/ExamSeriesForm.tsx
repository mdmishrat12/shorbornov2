// components/categories/ExamSeriesForm.tsx
import { CategoryFormData, ExamType } from '@/types/category.types';

interface ExamSeriesFormProps {
  formData: CategoryFormData;
  updateFormData: (field: keyof CategoryFormData, value: any) => void;
  examTypes: ExamType[];
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ExamSeriesForm({ formData, updateFormData, examTypes, onSubmit, isSubmitting }: ExamSeriesFormProps) {
  const isFormValid = 
    formData.examSeriesName.trim() !== '' && 
    formData.examSeriesExamTypeId !== '';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Exam Series</h3>
        <p className="text-gray-600 mb-6">Add exam series like BCS 44, BCS 45, HSC 2024, etc.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Type *
          </label>
          <select
            value={formData.examSeriesExamTypeId}
            onChange={(e) => updateFormData('examSeriesExamTypeId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Exam Type</option>
            {examTypes.map((examType) => (
              <option key={examType.id} value={examType.id}>
                {examType.name} {examType.shortCode && `(${examType.shortCode})`}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Series Name *
            </label>
            <input
              type="text"
              value={formData.examSeriesName}
              onChange={(e) => updateFormData('examSeriesName', e.target.value)}
              placeholder="e.g., 44, 45, 2024"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <input
              type="number"
              value={formData.examSeriesYear}
              onChange={(e) => updateFormData('examSeriesYear', parseInt(e.target.value) || new Date().getFullYear())}
              min="2000"
              max="2030"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.examSeriesFullName}
            onChange={(e) => updateFormData('examSeriesFullName', e.target.value)}
            placeholder="e.g., BCS 44, HSC 2024"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.examSeriesDescription}
            onChange={(e) => updateFormData('examSeriesDescription', e.target.value)}
            placeholder="Brief description of this exam series..."
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
          <span>{isSubmitting ? 'Creating...' : 'Create Exam Series'}</span>
        </button>
      </div>
    </div>
  );
}