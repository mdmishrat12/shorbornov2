// app/categories/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { CategoryTabs } from '@/components/categories/CategoryTabs';
import { ExamTypeForm } from '@/components/categories/ExamTypeForm';
import { ExamSeriesForm } from '@/components/categories/ExamSeriesForm';
import { SubjectForm } from '@/components/categories/SubjectForm';
import { TopicForm } from '@/components/categories/TopicForm';
import { StandardForm } from '@/components/categories/StandardForm';
import { CategoriesList } from '@/components/categories/CategoriesList';
import { SuccessModal } from '@/components/categories/SuccessModal';
import { useCategories } from '@/hooks/useCategories';
import { useCategoryForm } from '@/hooks/useCategoryForm';

export default function CategoriesPage() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { 
    categories, 
    loading, 
    error, 
    refetch,
    fetchExamSeries,
    fetchTopics 
  } = useCategories();

  const {
    formData,
    updateFormData,
    activeTab,
    setActiveTab,
    isSubmitting,
    submitForm,
    resetForm
  } = useCategoryForm();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    resetForm(tab);
  };

  const handleSubmit = async () => {
    const result = await submitForm();
    setLastResult(result);
    setShowSuccessModal(true);
    
    if (result.success) {
      // Refresh the categories list
      await refetch();
      
      // Refresh dependent data
      if (activeTab === 'exam-types') {
        // If we created an exam type, refresh exam series for it
        fetchExamSeries(formData.examSeriesExamTypeId);
      } else if (activeTab === 'subjects') {
        // If we created a subject, refresh topics for it
        fetchTopics(formData.topicSubjectId);
      }
    }
  };

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Categories Management
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage all question bank categories including exam types, series, subjects, topics, and standards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg">
              {/* Tabs */}
              <CategoryTabs 
                activeTab={activeTab} 
                onTabChange={handleTabChange} 
              />

              {/* Forms */}
              <div className="p-6">
                {activeTab === 'exam-types' && (
                  <ExamTypeForm
                    formData={formData}
                    updateFormData={updateFormData}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}

                {activeTab === 'exam-series' && (
                  <ExamSeriesForm
                    formData={formData}
                    updateFormData={updateFormData}
                    examTypes={categories.examTypes}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}

                {activeTab === 'subjects' && (
                  <SubjectForm
                    formData={formData}
                    updateFormData={updateFormData}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}

                {activeTab === 'topics' && (
                  <TopicForm
                    formData={formData}
                    updateFormData={updateFormData}
                    subjects={categories.subjects}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}

                {activeTab === 'standards' && (
                  <StandardForm
                    formData={formData}
                    updateFormData={updateFormData}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Lists */}
          <div className="lg:col-span-1">
            <CategoriesList
              activeTab={activeTab}
              examTypes={categories.examTypes}
              examSeries={categories.examSeries}
              subjects={categories.subjects}
              topics={categories.topics}
              standards={categories.standards}
              onRefresh={refetch}
            />
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        result={lastResult}
      />
    </div>
  );
}