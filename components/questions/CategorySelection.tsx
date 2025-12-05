// components/questions/CategorySelection.tsx

import { CategoryData, QuestionFormData } from "@/types/questions.type";

interface CategorySelectionProps {
  formData: QuestionFormData;
  updateFormData: (field: keyof QuestionFormData, value: any) => void;
  categories: CategoryData;
  onExamTypeChange: (examTypeId: string) => void;
  onSubjectChange: (subjectId: string) => void;
  onNext: () => void;
}

export function CategorySelection({
  formData,
  updateFormData,
  categories,
  onExamTypeChange,
  onSubjectChange,
  onNext
}: CategorySelectionProps) {
  const isFormValid = 
    formData.examTypeId && 
    formData.subjectId && 
    formData.difficultyLevel;

  // Safe function to get exam series display name
  const getExamSeriesDisplayName = (series: any) => {
    // Use fullName if available
    if (series.fullName) return series.fullName;
    
    // Fallback to name with examType name if available
    if (series.examType?.name) {
      return `${series.examType.name} ${series.name}`;
    }
    
    // Final fallback to just the series name
    return series.name;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exam Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Type *
          </label>
          <select
            value={formData.examTypeId || ""}
            onChange={(e) => onExamTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            suppressHydrationWarning
          >
            <option value="">Select Exam Type</option>
            {categories.examTypes.map((examType) => (
              <option key={examType.id} value={examType.id}>
                {examType.name} {examType.shortCode && `(${examType.shortCode})`}
              </option>
            ))}
          </select>
        </div>

        {/* Exam Series */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Series
          </label>
          <select
            value={formData.examSeriesId || ""}
            onChange={(e) => updateFormData('examSeriesId', e.target.value)}
            disabled={!formData.examTypeId}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            suppressHydrationWarning
          >
            <option value="">Select Exam Series</option>
            {categories.examSeries.map((series) => (
              <option key={series.id} value={series.id}>
                {getExamSeriesDisplayName(series)}
                {series.year && ` (${series.year})`}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <select
            value={formData.subjectId || ""}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            suppressHydrationWarning
          >
            <option value="">Select Subject</option>
            {categories.subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic
          </label>
          <select
            value={formData.topicId || ""}
            onChange={(e) => updateFormData('topicId', e.target.value)}
            disabled={!formData.subjectId}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            suppressHydrationWarning
          >
            <option value="">Select Topic</option>
            {categories.topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        {/* Standard */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Standard/Class
          </label>
          <select
            value={formData.standardId || ""}
            onChange={(e) => updateFormData('standardId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            suppressHydrationWarning
          >
            <option value="">Select Standard</option>
            {categories.standards.map((standard) => (
              <option key={standard.id} value={standard.id}>
                {standard.name}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level *
          </label>
          <select
            value={formData.difficultyLevel || "easy"}
            onChange={(e) => updateFormData('difficultyLevel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            suppressHydrationWarning
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="analytical">Analytical</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Category Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Exam Type:</span>
            <span className="ml-2 font-medium">
              {categories.examTypes.find(et => et.id === formData.examTypeId)?.name || 'Not selected'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Subject:</span>
            <span className="ml-2 font-medium">
              {categories.subjects.find(s => s.id === formData.subjectId)?.name || 'Not selected'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Difficulty:</span>
            <span className="ml-2 font-medium capitalize">{formData.difficultyLevel || 'Not selected'}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Next: Question Details
        </button>
      </div>
    </div>
  );
}