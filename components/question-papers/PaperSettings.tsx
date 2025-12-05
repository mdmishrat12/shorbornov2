// components/question-papers/PaperSettings.tsx
'use client';

import { QuestionPaperFormData } from '@/types/question-paper.type';

interface PaperSettingsProps {
  formData: QuestionPaperFormData;
  updateFormData: (field: keyof QuestionPaperFormData, value: any) => void;
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function PaperSettings({
  formData,
  updateFormData,
  onPrev,
  onSubmit,
  isSubmitting,
}: PaperSettingsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Paper Settings & Review</h2>

      {/* Display Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Display & Behavior</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.shuffleQuestions}
              onChange={(e) => updateFormData('shuffleQuestions', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-700">Shuffle Questions</span>
              <p className="text-sm text-gray-500">Questions will appear in random order</p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.shuffleOptions}
              onChange={(e) => updateFormData('shuffleOptions', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-700">Shuffle Options</span>
              <p className="text-sm text-gray-500">Multiple choice options will be shuffled</p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.showExplanation}
              onChange={(e) => updateFormData('showExplanation', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-700">Show Explanations</span>
              <p className="text-sm text-gray-500">Show explanations after answering</p>
            </div>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.allowReview}
              onChange={(e) => updateFormData('allowReview', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="font-medium text-gray-700">Allow Review</span>
              <p className="text-sm text-gray-500">Students can review their answers</p>
            </div>
          </label>
        </div>
      </div>

      {/* Negative Marking */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Negative Marking</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.negativeMarking.enabled}
              onChange={(e) =>
                updateFormData('negativeMarking', {
                  ...formData.negativeMarking,
                  enabled: e.target.checked,
                })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">Enable Negative Marking</span>
          </label>

          {formData.negativeMarking.enabled && (
            <div className="pl-7">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deduct marks per wrong answer
              </label>
              <div className="flex items-center space-x-4">
                <select
                  value={formData.negativeMarking.perIncorrect}
                  onChange={(e) =>
                    updateFormData('negativeMarking', {
                      ...formData.negativeMarking,
                      perIncorrect: parseFloat(e.target.value),
                    })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="0.25">¼ mark (0.25)</option>
                  <option value="0.33">⅓ mark (0.33)</option>
                  <option value="0.50">½ mark (0.50)</option>
                  <option value="1">1 mark</option>
                  <option value="2">2 marks</option>
                </select>
                <span className="text-sm text-gray-500">
                  Deduct {formData.negativeMarking.perIncorrect} marks for each wrong answer
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Result Release */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Result Release</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="resultRelease"
                value="instant"
                checked={formData.resultRelease === 'instant'}
                onChange={(e) => updateFormData('resultRelease', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-700">Instant</span>
                <span className="block text-sm text-gray-500">Immediately after submission</span>
              </div>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="resultRelease"
                value="scheduled"
                checked={formData.resultRelease === 'scheduled'}
                onChange={(e) => updateFormData('resultRelease', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-700">Scheduled</span>
                <span className="block text-sm text-gray-500">Release at specific time</span>
              </div>
            </label>

            <label className="flex items-center">
              <input
                type="radio"
                name="resultRelease"
                value="manual"
                checked={formData.resultRelease === 'manual'}
                onChange={(e) => updateFormData('resultRelease', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-gray-700">Manual</span>
                <span className="block text-sm text-gray-500">Released by teacher</span>
              </div>
            </label>
          </div>

          {formData.resultRelease === 'scheduled' && (
            <div className="pl-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule Result Release
              </label>
              <input
                type="datetime-local"
                value={formData.resultReleaseAt || ''}
                onChange={(e) => updateFormData('resultReleaseAt', e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Paper Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formData.duration}</div>
            <div className="text-sm text-blue-700">Minutes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formData.totalMarks}</div>
            <div className="text-sm text-blue-700">Total Marks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formData.generationCriteria?.totalQuestions || 'N/A'}
            </div>
            <div className="text-sm text-blue-700">Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{formData.passingScore}%</div>
            <div className="text-sm text-blue-700">Passing Score</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onPrev}
          disabled={isSubmitting}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          ← Back to Questions
        </button>
        <div className="space-x-4">
          <button
            onClick={() => {
              // Save as draft logic here
              console.log('Save as draft');
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Save as Draft
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg font-medium ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></span>
                Creating Paper...
              </>
            ) : (
              'Create Question Paper'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}