// components/categories/SubjectForm.tsx
import { CategoryFormData } from '@/types/category.types';

interface SubjectFormProps {
  formData: CategoryFormData;
  updateFormData: (field: keyof CategoryFormData, value: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function SubjectForm({ formData, updateFormData, onSubmit, isSubmitting }: SubjectFormProps) {
  const isFormValid = formData.subjectName.trim() !== '';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Subject</h3>
        <p className="text-gray-600 mb-6">Add subjects for question categorization like Mathematics, English, Bangla, etc.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject Name *
          </label>
          <input
            type="text"
            value={formData.subjectName}
            onChange={(e) => updateFormData('subjectName', e.target.value)}
            placeholder="e.g., Mathematics, English, Bangla"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject Code
          </label>
          <input
            type="text"
            value={formData.subjectCode}
            onChange={(e) => updateFormData('subjectCode', e.target.value)}
            placeholder="e.g., MATH, ENG, BAN"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.subjectDescription}
            onChange={(e) => updateFormData('subjectDescription', e.target.value)}
            placeholder="Brief description of this subject..."
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
          <span>{isSubmitting ? 'Creating...' : 'Create Subject'}</span>
        </button>
      </div>
    </div>
  );
}