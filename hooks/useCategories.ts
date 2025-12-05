// hooks/useCategories.ts
import { useState, useEffect } from 'react';
import { ExamType, ExamSeries, QuestionBankSubject, Topic, Standard } from '@/types/category.types';

interface CategoriesData {
  examTypes: ExamType[];
  examSeries: ExamSeries[];
  subjects: QuestionBankSubject[];
  topics: Topic[];
  standards: Standard[];
}

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoriesData>({
    examTypes: [],
    examSeries: [],
    subjects: [], // This should already be questionBankSubjects from your API
    topics: [],
    standards: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching categories from /api/categories');
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Categories API response:', result);
      
      if (result.success) {
        // Log what subjects we're getting
        console.log('Subjects received:', {
          count: result.data?.subjects?.length || 0,
          sample: result.data?.subjects?.[0]
        });
        
        setCategories({
          examTypes: result.data?.examTypes || [],
          examSeries: result.data?.examSeries || [],
          subjects: result.data?.subjects || [], // Should be questionBankSubjects
          topics: result.data?.topics || [],
          standards: result.data?.standards || [],
        });
      } else {
        setError(result.error || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchExamSeries = async (examTypeId: string) => {
    try {
      console.log(`Fetching exam series for examTypeId: ${examTypeId}`);
      const response = await fetch(`/api/categories/exam-series?examTypeId=${examTypeId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Exam series response:', result);
      
      if (result.success) {
        setCategories(prev => ({
          ...prev,
          examSeries: result.data || []
        }));
      }
    } catch (err) {
      console.error('Error fetching exam series:', err);
    }
  };

  const fetchTopics = async (subjectId: string) => {
    try {
      console.log(`Fetching topics for subjectId: ${subjectId}`);
      const response = await fetch(`/api/categories/topics?subjectId=${subjectId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Topics response:', result);
      
      if (result.success) {
        setCategories(prev => ({
          ...prev,
          topics: result.data || []
        }));
      }
    } catch (err) {
      console.error('Error fetching topics:', err);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchAllCategories,
    fetchExamSeries,
    fetchTopics,
  };
};