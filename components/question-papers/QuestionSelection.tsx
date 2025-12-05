'use client';

import { useState } from 'react';
import { QuestionPaperFormData } from '@/types/question-paper.type';
import { useCategories } from '@/hooks/useCategories';
import { RandomGenerationForm } from './RandomGenerationForm';
import { ManualQuestionForm } from './ManualQuestionForm';

interface Props {
  formData: QuestionPaperFormData;
  updateFormData: (field: keyof QuestionPaperFormData, value: any) => void;
  manualQuestions: any[];
  addManualQuestion: (question: any) => void;
  removeManualQuestion: (id: string) => void;
  updateManualQuestion: (id: string, updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function QuestionSelection({
  formData,
  updateFormData,
  manualQuestions,
  addManualQuestion,
  removeManualQuestion,
  updateManualQuestion,
  onNext,
  onPrev,
}: Props) {
  const { categories } = useCategories();
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const handleGenerateRandom = async () => {
    if (formData.generationCriteria) {
      try {
        const response = await fetch(`/api/question-papers/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            criteria: formData.generationCriteria,
          }),
        });

        const result = await response.json();
        if (result.success) {
          alert('Questions generated successfully!');
        }
      } catch (error) {
        console.error('Error generating questions:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Questions</h2>

      {formData.creationMethod === 'manual' && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Manual Questions</h3>
            <button
              onClick={() => setShowQuestionForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Add Question
            </button>
          </div>

          {manualQuestions.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No questions added yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Click "Add Question" to start building your paper
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {manualQuestions.map((q, index) => (
                <div key={q.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-medium">Q{index + 1}:</span>
                      <span className="ml-2">{q.question.substring(0, 100)}...</span>
                    </div>
                    <button
                      onClick={() => removeManualQuestion(q.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>Marks: {q.marks}</span>
                    <span className="mx-2">•</span>
                    <span>Difficulty: {q.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {formData.creationMethod === 'random' && (
        <RandomGenerationForm
          formData={formData}
          updateFormData={updateFormData}
          categories={categories}
          onGenerate={handleGenerateRandom}
        />
      )}

      {/* Question Form Modal */}
      {showQuestionForm && (
        <ManualQuestionForm
          onClose={() => setShowQuestionForm(false)}
          onSubmit={addManualQuestion}
        />
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={formData.creationMethod === 'manual' && manualQuestions.length === 0}
          className={`px-6 py-3 rounded-lg font-medium ${
            formData.creationMethod === 'manual' && manualQuestions.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next: Paper Settings →
        </button>
      </div>
    </div>
  );
}