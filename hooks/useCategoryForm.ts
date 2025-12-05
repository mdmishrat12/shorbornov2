// hooks/useCategoryForm.ts
import { useState } from 'react';
import { CategoryFormData, ApiResponse } from '@/types/category.types';

export const useCategoryForm = () => {
  const [formData, setFormData] = useState<CategoryFormData>({
    examTypeName: '',
    examTypeShortCode: '',
    examTypeDescription: '',
    examSeriesName: '',
    examSeriesFullName: '',
    examSeriesYear: new Date().getFullYear(),
    examSeriesDescription: '',
    examSeriesExamTypeId: '',
    subjectName: '',
    subjectCode: '',
    subjectDescription: '',
    topicName: '',
    topicDescription: '',
    topicSubjectId: '',
    standardName: '',
    standardLevel: 1,
    standardDescription: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'exam-types' | 'exam-series' | 'subjects' | 'topics' | 'standards'>('exam-types');

  const updateFormData = (field: keyof CategoryFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = (tab: string) => {
    const resetData: Partial<CategoryFormData> = {};
    
    switch (tab) {
      case 'exam-types':
        resetData.examTypeName = '';
        resetData.examTypeShortCode = '';
        resetData.examTypeDescription = '';
        break;
      case 'exam-series':
        resetData.examSeriesName = '';
        resetData.examSeriesFullName = '';
        resetData.examSeriesYear = new Date().getFullYear();
        resetData.examSeriesDescription = '';
        resetData.examSeriesExamTypeId = '';
        break;
      case 'subjects':
        resetData.subjectName = '';
        resetData.subjectCode = '';
        resetData.subjectDescription = '';
        break;
      case 'topics':
        resetData.topicName = '';
        resetData.topicDescription = '';
        resetData.topicSubjectId = '';
        break;
      case 'standards':
        resetData.standardName = '';
        resetData.standardLevel = 1;
        resetData.standardDescription = '';
        break;
    }
    
    setFormData(prev => ({ ...prev, ...resetData }));
  };

  const createExamType = async (): Promise<ApiResponse> => {
    try {
      const response = await fetch('/api/categories/exam-types', { // FIXED: Added hyphen
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.examTypeName,
          shortCode: formData.examTypeShortCode,
          description: formData.examTypeDescription,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating exam type:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to create exam type' 
      };
    }
  };

  const createExamSeries = async (): Promise<ApiResponse> => {
    try {
      const response = await fetch('/api/categories/exam-series', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.examSeriesName,
          examTypeId: formData.examSeriesExamTypeId,
          fullName: formData.examSeriesFullName,
          year: formData.examSeriesYear,
          description: formData.examSeriesDescription,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating exam series:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to create exam series' 
      };
    }
  };

  const createSubject = async (): Promise<ApiResponse> => {
    try {
      const response = await fetch('/api/categories/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.subjectName,
          code: formData.subjectCode,
          description: formData.subjectDescription,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating subject:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to create subject' 
      };
    }
  };

  const createTopic = async (): Promise<ApiResponse> => {
    try {
      const response = await fetch('/api/categories/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.topicName,
          subjectId: formData.topicSubjectId,
          description: formData.topicDescription,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating topic:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to create topic' 
      };
    }
  };

  const createStandard = async (): Promise<ApiResponse> => {
    try {
      const response = await fetch('/api/categories/standards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.standardName,
          level: formData.standardLevel,
          description: formData.standardDescription,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating standard:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to create standard' 
      };
    }
  };

  const submitForm = async (): Promise<ApiResponse> => {
    setIsSubmitting(true);
    try {
      let result: ApiResponse;
      
      switch (activeTab) {
        case 'exam-types':
          result = await createExamType();
          break;
        case 'exam-series':
          result = await createExamSeries();
          break;
        case 'subjects':
          result = await createSubject();
          break;
        case 'topics':
          result = await createTopic();
          break;
        case 'standards':
          result = await createStandard();
          break;
        default:
          result = { success: false, message: 'Invalid category type' };
      }

      if (result.success) {
        resetForm(activeTab);
      }
      
      return result;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    updateFormData,
    activeTab,
    setActiveTab,
    isSubmitting,
    submitForm,
    resetForm,
  };
};