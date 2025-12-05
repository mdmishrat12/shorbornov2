// components/questions/QuestionForm.tsx

import { QuestionFormData } from "@/types/questions.type";

interface QuestionFormProps {
  formData: QuestionFormData;
  updateFormData: (field: keyof QuestionFormData, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function QuestionForm({ formData, updateFormData, onNext, onPrev }: QuestionFormProps) {
  const isFormValid = 
    formData.question.trim() && 
    formData.optionA.trim() && 
    formData.optionB.trim() && 
    formData.optionC.trim() && 
    formData.optionD.trim() && 
    formData.correctAnswer;

  return (
    <div className="space-y-6">
      {/* Question Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question *
        </label>
        <textarea
          value={formData.question}
          onChange={(e) => updateFormData('question', e.target.value)}
          placeholder="Enter your question here..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['A', 'B', 'C', 'D'] as const).map((option) => (
          <div key={option} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Option {option} *
            </label>
            <textarea
              value={formData[`option${option}` as keyof QuestionFormData] as string}
              onChange={(e) => updateFormData(`option${option}` as keyof QuestionFormData, e.target.value)}
              placeholder={`Enter option ${option}...`}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            
            {/* Correct Answer Indicator */}
            <button
              onClick={() => updateFormData('correctAnswer', option)}
              className={`absolute top-8 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                formData.correctAnswer === option
                  ? 'bg-green-500 border-green-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}
              title="Mark as correct answer"
            >
              ✓
            </button>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Explanation
        </label>
        <textarea
          value={formData.explanation}
          onChange={(e) => updateFormData('explanation', e.target.value)}
          placeholder="Provide explanation for the correct answer..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onPrev}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Back to Categories
        </button>
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Next: Review & Submit
        </button>
      </div>
    </div>
  );
}