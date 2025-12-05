// hooks/useQuestionPaperForm.ts
import { useState } from 'react';
import { QuestionPaperFormData } from '@/types/question-paper.type';

export const useQuestionPaperForm = () => {
  const [formData, setFormData] = useState<QuestionPaperFormData>({
    title: '',
    description: '',
    creationMethod: 'manual',
    sourceType: 'bank',
    duration: 180,
    totalMarks: 100,
    passingScore: 40,
    shuffleQuestions: true,
    shuffleOptions: true,
    showExplanation: false,
    allowReview: true,
    negativeMarking: {
      enabled: false,
      perIncorrect: 0.25,
    },
    resultRelease: 'instant',
    tags: [],
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualQuestions, setManualQuestions] = useState<any[]>([]);

  const updateFormData = (field: keyof QuestionPaperFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const addManualQuestion = (question: any) => {
    setManualQuestions(prev => [...prev, { ...question, id: Date.now().toString() }]);
  };

  const removeManualQuestion = (id: string) => {
    setManualQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateManualQuestion = (id: string, updates: any) => {
    setManualQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, ...updates } : q)
    );
  };

  const submitQuestionPaper = async (): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      setIsSubmitting(true);

      // Prepare final data
      const submissionData = {
        ...formData,
        manualQuestions: formData.creationMethod === 'manual' ? manualQuestions : undefined,
      };

      const response = await fetch('/api/question-papers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (result.success) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          creationMethod: 'manual',
          sourceType: 'bank',
          duration: 180,
          totalMarks: 100,
          passingScore: 40,
          shuffleQuestions: true,
          shuffleOptions: true,
          showExplanation: false,
          allowReview: true,
          negativeMarking: {
            enabled: false,
            perIncorrect: 0.25,
          },
          resultRelease: 'instant',
          tags: [],
        });
        setManualQuestions([]);
        setCurrentStep(1);
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create question paper',
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
};