// app/questions/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { CategorySelection } from '@/components/questions/CategorySelection';
import { QuestionForm } from '@/components/questions/QuestionForm';
import { MetadataForm } from '@/components/questions/MetadataForm';
import { QuestionPreview } from '@/components/questions/QuestionPreview';
import { SuccessModal } from '@/components/questions/SuccessModal';
import { useQuestionForm } from '@/hooks/useQuestionForms';

export default function CreateQuestionPage() {
  const { categories, loading, fetchExamSeries, fetchTopics } = useCategories();
  const {
    formData,
    updateFormData,
    currentStep,
    nextStep,
    prevStep,
    isSubmitting,
    submitQuestion
  } = useQuestionForm();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<{ success: boolean; message: string } | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Add this useEffect to handle client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async () => {
    const result = await submitQuestion();
    setLastSubmission(result);
    setShowSuccessModal(true);
  };

  const handleExamTypeChange = (examTypeId: string) => {
    updateFormData('examTypeId', examTypeId);
    updateFormData('examSeriesId', '');
    if (examTypeId) {
      fetchExamSeries(examTypeId);
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    updateFormData('subjectId', subjectId);
    updateFormData('topicId', '');
    if (subjectId) {
      fetchTopics(subjectId);
    }
  };

  // Show loading state until client-side mounting is complete
  if (loading || !isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Create New Question
          </h1>
          <p className="text-gray-600">
            Build your question bank with comprehensive categorization
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>
              Categories
            </span>
            <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>
              Question & Options
            </span>
            <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>
              Metadata & Review
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {currentStep === 1 && (
                <CategorySelection
                  formData={formData}
                  updateFormData={updateFormData}
                  categories={categories}
                  onExamTypeChange={handleExamTypeChange}
                  onSubjectChange={handleSubjectChange}
                  onNext={nextStep}
                />
              )}

              {currentStep === 2 && (
                <QuestionForm
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              )}

              {currentStep === 3 && (
                <MetadataForm
                  formData={formData}
                  updateFormData={updateFormData}
                  onPrev={prevStep}
                  onSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <QuestionPreview formData={formData} />
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        result={lastSubmission}
      />
    </div>
  );
}