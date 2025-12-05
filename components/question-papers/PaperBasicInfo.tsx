// components/question-papers/PaperBasicInfo.tsx
'use client';

import { QuestionPaperFormData } from '@/types/question-paper.type';

interface PaperBasicInfoProps {
  formData: QuestionPaperFormData;
  updateFormData: (field: keyof QuestionPaperFormData, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function PaperBasicInfo({ formData, updateFormData, onNext, onPrev }: PaperBasicInfoProps) {
  const durations = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' },
    { value: 300, label: '5 hours' },
  ];

  const marksOptions = [
    { value: 50, label: '50 marks' },
    { value: 100, label: '100 marks' },
    { value: 150, label: '150 marks' },
    { value: 200, label: '200 marks' },
    { value: 300, label: '300 marks' },
  ];

  const passingOptions = [
    { value: 33, label: '33%' },
    { value: 40, label: '40%' },
    { value: 50, label: '50%' },
    { value: 60, label: '60%' },
    { value: 75, label: '75%' },
  ];

  const handleNext = () => {
    if (formData.title.trim() && formData.duration > 0 && formData.totalMarks > 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Paper Basic Information</h2>

      {/* Title & Description */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paper Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., BCS Preliminary Exam 2024, Physics Final Exam"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Describe the purpose, syllabus coverage, or special instructions..."
          />
        </div>
      </div>

      {/* Duration, Marks & Passing Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration *
          </label>
          <select
            value={formData.duration}
            onChange={(e) => updateFormData('duration', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select duration</option>
            {durations.map((duration) => (
              <option key={duration.value} value={duration.value}>
                {duration.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Marks *
          </label>
          <select
            value={formData.totalMarks}
            onChange={(e) => updateFormData('totalMarks', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select total marks</option>
            {marksOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passing Score
          </label>
          <select
            value={formData.passingScore}
            onChange={(e) => updateFormData('passingScore', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {passingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags (Optional)
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags?.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => {
                  const newTags = formData.tags?.filter((_, i) => i !== index);
                  updateFormData('tags', newTags);
                }}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Add tags (press Enter to add)"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              e.preventDefault();
              const newTag = e.currentTarget.value.trim();
              const newTags = [...(formData.tags || []), newTag];
              updateFormData('tags', newTags);
              e.currentTarget.value = '';
            }
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <p className="text-sm text-gray-500 mt-1">
          Add tags like "BCS", "Physics", "MCQ", etc. to help organize papers
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          ← Back to Method
        </button>
        <button
          onClick={handleNext}
          disabled={!formData.title.trim() || !formData.duration || !formData.totalMarks}
          className={`px-6 py-3 rounded-lg font-medium ${
            !formData.title.trim() || !formData.duration || !formData.totalMarks
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next: Select Questions →
        </button>
      </div>
    </div>
  );
}