// app/question-papers/create/page.tsx
'use client';

import { useState } from 'react';
import { useQuestionPaperForm } from '@/hooks/useQuestionPaperForm';
import { CreationMethodSelection } from '@/components/question-papers/CreationMethodSelection';
import { PaperBasicInfo } from '@/components/question-papers/PaperBasicInfo';
import { QuestionSelection } from '@/components/question-papers/QuestionSelection';
import { PaperSettings } from '@/components/question-papers/PaperSettings';
import { PaperPreview } from '@/components/question-papers/PaperPreview';
import { SuccessModal } from '@/components/question-papers/SuccessModal';

export default function CreateQuestionPaperPage() {
  const {
    formData,
    updateFormData,
    manualQuestions,
    addManualQuestion,
    removeManualQuestion,
    updateManualQuestion,
    currentStep,
    nextStep,
    prevStep,
    isSubmitting,
    submitQuestionPaper,
  } = useQuestionPaperForm();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async () => {
    const result = await submitQuestionPaper();
    setLastSubmission(result);
    setShowSuccessModal(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CreationMethodSelection
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <PaperBasicInfo
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <QuestionSelection
            formData={formData}
            updateFormData={updateFormData}
            manualQuestions={manualQuestions}
            addManualQuestion={addManualQuestion}
            removeManualQuestion={removeManualQuestion}
            updateManualQuestion={updateManualQuestion}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <PaperSettings
            formData={formData}
            updateFormData={updateFormData}
            onPrev={prevStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Create Question Paper
          </h1>
          <p className="text-gray-600">
            Create exam papers manually or generate automatically from question bank
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map((step) => (
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
                {step < 4 && (
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
              Method
            </span>
            <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>
              Basic Info
            </span>
            <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>
              Questions
            </span>
            <span className={currentStep >= 4 ? 'text-blue-600 font-medium' : ''}>
              Settings
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {renderStep()}
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <PaperPreview
                formData={formData}
                manualQuestions={manualQuestions}
              />
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