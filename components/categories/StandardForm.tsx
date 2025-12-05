// components/categories/StandardForm.tsx
import { CategoryFormData } from '@/types/category.types';

interface StandardFormProps {
  formData: CategoryFormData;
  updateFormData: (field: keyof CategoryFormData, value: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function StandardForm({ formData, updateFormData, onSubmit, isSubmitting }: StandardFormProps) {
  const isFormValid = formData.standardName.trim() !== '';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Standard</h3>
        <p className="text-gray-600 mb-6">Add educational standards like Class 9, Class 10, Undergraduate, etc.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Standard Name *
            </label>
            <input
              type="text"
              value={formData.standardName}
              onChange={(e) => updateFormData('standardName', e.target.value)}
              placeholder="e.g., Class 9, Undergraduate"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <input
              type="number"
              value={formData.standardLevel}
              onChange={(e) => updateFormData('standardLevel', parseInt(e.target.value) || 1)}
              min="1"
              max="12"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.standardDescription}
            onChange={(e) => updateFormData('standardDescription', e.target.value)}
            placeholder="Brief description of this standard..."
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
          <span>{isSubmitting ? 'Creating...' : 'Create Standard'}</span>
        </button>
      </div>
    </div>
  );
}