// hooks/useQuestionForm.ts
import { QuestionFormData } from '@/types/questions.type';
import { useState } from 'react';

export const useQuestionForm = () => {
  const [formData, setFormData] = useState<QuestionFormData>({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    explanation: '',
    subjectId: '',
    examTypeId: '',
    examSeriesId: '',
    topicId: '',
    difficultyLevel: 'medium',
    standardId: '',
    questionNumber: undefined,
    marks: 1,
    timeLimit: 60,
    hasImage: false,
    imageUrl: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof QuestionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitQuestion = async (): Promise<{ success: boolean; message: string }> => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Reset form after successful submission
        setFormData({
          question: '',
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          correctAnswer: 'A',
          explanation: '',
          subjectId: '',
          examTypeId: '',
          examSeriesId: '',
          topicId: '',
          difficultyLevel: 'medium',
          standardId: '',
          questionNumber: undefined,
          marks: 1,
          timeLimit: 60,
          hasImage: false,
          imageUrl: ''
        });
        setCurrentStep(1);
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to submit question'
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    isSubmitting,
    submitQuestion
  };
};