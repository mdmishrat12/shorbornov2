// components/study/StudyFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';

interface StudyFiltersProps {
  filters: {
    subjectId: string;
    examTypeId: string;
    topicId: string;
    difficultyLevel: string;
    standardId: string;
    searchQuery: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

export function StudyFilters({ filters, onFilterChange, onReset, onApply }: StudyFiltersProps) {
  const { categories, loading, fetchExamSeries, fetchTopics } = useCategories();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    console.log('Available subjects:', categories.subjects);
    console.log('Current subject filter:', filters.subjectId);
  }, [categories.subjects, filters.subjectId]);

  useEffect(() => {
    if (filters.examTypeId) {
      fetchExamSeries(filters.examTypeId);
    }
  }, [filters.examTypeId]);

  useEffect(() => {
    if (filters.subjectId) {
      fetchTopics(filters.subjectId);
    }
  }, [filters.subjectId]);

  const handleExamTypeChange = (examTypeId: string) => {
    onFilterChange('examTypeId', examTypeId);
    onFilterChange('examSeriesId', ''); // Reset exam series
  };

  const handleSubjectChange = (subjectId: string) => {
    onFilterChange('subjectId', subjectId);
    onFilterChange('topicId', ''); // Reset topic when subject changes
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filter Questions</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {isExpanded ? '▲ Collapse' : '▼ Expand'} Filters
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search questions or explanations..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange('searchQuery', e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Expandable Filters */}
      {isExpanded && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Exam Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Type
              </label>
              <select
                value={filters.examTypeId}
                onChange={(e) => handleExamTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Exam Types</option>
                {categories.examTypes.map((examType) => (
                  <option key={examType.id} value={examType.id}>
                    {examType.name} {examType.shortCode && `(${examType.shortCode})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject - Now using questionBankSubjects */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={filters.subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Subjects</option>
                {categories.subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} {subject.code && `(${subject.code})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <select
                value={filters.topicId}
                onChange={(e) => onFilterChange('topicId', e.target.value)}
                disabled={!filters.subjectId}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">All Topics</option>
                {categories.topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={filters.difficultyLevel}
                onChange={(e) => onFilterChange('difficultyLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="analytical">Analytical</option>
              </select>
            </div>

            {/* Standard */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Standard/Class
              </label>
              <select
                value={filters.standardId}
                onChange={(e) => onFilterChange('standardId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Standards</option>
                {categories.standards.map((standard) => (
                  <option key={standard.id} value={standard.id}>
                    {standard.name} {standard.level && `(Level ${standard.level})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Filter Actions */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t">
        <button
          onClick={onReset}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          Reset All Filters
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => {
              onApply();
              setIsExpanded(false);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={onApply}
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}