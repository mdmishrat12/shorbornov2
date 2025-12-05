// components/categories/TopicForm.tsx
import { CategoryFormData, QuestionBankSubject } from '@/types/category.types';

interface TopicFormProps {
  formData: CategoryFormData;
  updateFormData: (field: keyof CategoryFormData, value: any) => void;
  subjects: QuestionBankSubject[];
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function TopicForm({ formData, updateFormData, subjects, onSubmit, isSubmitting }: TopicFormProps) {
  const isFormValid = 
    formData.topicName.trim() !== '' && 
    formData.topicSubjectId !== '';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Topic</h3>
        <p className="text-gray-600 mb-6">Add topics under subjects like Algebra, Geometry, Grammar, etc.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <select
            value={formData.topicSubjectId}
            onChange={(e) => updateFormData('topicSubjectId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic Name *
          </label>
          <input
            type="text"
            value={formData.topicName}
            onChange={(e) => updateFormData('topicName', e.target.value)}
            placeholder="e.g., Algebra, Geometry, Grammar"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.topicDescription}
            onChange={(e) => updateFormData('topicDescription', e.target.value)}
            placeholder="Brief description of this topic..."
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
          <span>{isSubmitting ? 'Creating...' : 'Create Topic'}</span>
        </button>
      </div>
    </div>
  );
}