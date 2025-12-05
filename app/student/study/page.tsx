// app/study/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StudyStats } from '@/components/study/StudyStats';
import { EmptyState } from '@/components/study/EmptyState';
import { QuestionCard } from '@/components/study/QuestionCard';
import { QuestionFormData } from '@/types/questions.type';
import { StudyFilters } from '@/components/study/StudyFilters';

// Extend QuestionFormData to include additional fields needed for display
interface Question extends QuestionFormData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  createdBy: string;
}

interface FilterState {
  subjectId: string;
  examTypeId: string;
  topicId: string;
  difficultyLevel: string;
  standardId: string;
  searchQuery: string;
}

export default function StudyPage() {
  const { data: session, status } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<FilterState>({
    subjectId: '',
    examTypeId: '',
    topicId: '',
    difficultyLevel: '',
    standardId: '',
    searchQuery: '',
  });

  // In your study page, add this after fetching questions:
useEffect(() => {
  console.log('Questions fetched:', questions);
  if (questions.length > 0) {
    console.log('Sample question data:', {
      subjectId: questions[0].subjectId,
      examTypeId: questions[0].examTypeId,
      topicId: questions[0].topicId,
      standardId: questions[0].standardId,
    });
  }
}, [questions]);

  // Fetch questions on mount and when filters change
  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, filters]);

// In your study page, update the fetchQuestions function:
const fetchQuestions = async () => {
  try {
    setLoading(true);
    
    // Build query params safely
    const params = new URLSearchParams();
    
    // Only add non-empty params
    if (filters.subjectId && filters.subjectId.trim()) {
      params.append('subjectId', filters.subjectId.trim());
    }
    if (filters.examTypeId && filters.examTypeId.trim()) {
      params.append('examTypeId', filters.examTypeId.trim());
    }
    if (filters.topicId && filters.topicId.trim()) {
      params.append('topicId', filters.topicId.trim());
    }
    if (filters.difficultyLevel && filters.difficultyLevel.trim()) {
      params.append('difficultyLevel', filters.difficultyLevel.trim());
    }
    if (filters.standardId && filters.standardId.trim()) {
      params.append('standardId', filters.standardId.trim());
    }
    if (filters.searchQuery && filters.searchQuery.trim()) {
      params.append('search', filters.searchQuery.trim());
    }
    
    console.log('Fetching with params:', params.toString());

    // const response = await fetch(`/api/questions?${params.toString()}`);
    const response = await fetch(`/api/questions`);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('API returned error:', data);
      setQuestions([]);
      return;
    }
    
    if (data.success) {
      console.log('Questions received:', data.data);
      setQuestions(data.data || []);
    } else {
      console.error('API returned unsuccessful:', data);
      setQuestions([]);
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    setQuestions([]);
  } finally {
    setLoading(false);
  }
};

// In your study page, update the filterQuestions function:
const filterQuestions = () => {
  if (!questions || !Array.isArray(questions)) {
    setFilteredQuestions([]);
    return;
  }

  let filtered = [...questions];

  // Apply search query filter
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(q => {
      if (!q) return false;
      return (
        (q.question && q.question.toLowerCase().includes(query)) ||
        (q.explanation && q.explanation.toLowerCase().includes(query)) ||
        (q.topicId && q.topicId.toLowerCase().includes(query))
      );
    });
  }

  // Apply other filters
  if (filters.subjectId) {
    filtered = filtered.filter(q => q.subjectId === filters.subjectId);
  }
  if (filters.examTypeId) {
    filtered = filtered.filter(q => q.examTypeId === filters.examTypeId);
  }
  if (filters.topicId) {
    filtered = filtered.filter(q => q.topicId === filters.topicId);
  }
  if (filters.difficultyLevel) {
    filtered = filtered.filter(q => q.difficultyLevel === filters.difficultyLevel);
  }
  if (filters.standardId) {
    filtered = filtered.filter(q => q.standardId === filters.standardId);
  }

  setFilteredQuestions(filtered);
};

  const toggleAnswer = (questionId: string) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const toggleAllAnswers = () => {
    if (Object.keys(showAnswers).length === filteredQuestions.length) {
      // If all are shown, hide all
      setShowAnswers({});
    } else {
      // Show all answers
      const allAnswers: Record<string, boolean> = {};
      filteredQuestions.forEach(q => {
        allAnswers[q.id] = true;
      });
      setShowAnswers(allAnswers);
    }
  };

  const handleFilterChange = (filterName: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      subjectId: '',
      examTypeId: '',
      topicId: '',
      difficultyLevel: '',
      standardId: '',
      searchQuery: '',
    });
  };

  if (status === 'loading' || loading) {
    return <LoadingSpinner fullScreen />;
  }

        console.log('consoling questions: ',questions)


  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please sign in to access study materials</h2>
          <p className="text-gray-600">You need to be logged in to view study questions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Study Questions
          </h1>
          <p className="text-gray-600">
            Practice questions with detailed explanations. Toggle answers to test your knowledge.
          </p>
        </div>

        {/* Stats Summary */}
        <StudyStats 
          totalQuestions={questions.length}
          filteredQuestions={filteredQuestions.length}
          showAnswers={showAnswers}
          onToggleAll={toggleAllAnswers}
        />

        {/* Filters Section */}
        <div className="mb-8">
          <StudyFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            onApply={fetchQuestions}
          />
        </div>

        {/* Questions Grid */}
        {filteredQuestions.length === 0 ? (
          <EmptyState 
            onResetFilters={resetFilters}
            isSearchActive={!!filters.searchQuery || 
              !!filters.subjectId || 
              !!filters.difficultyLevel}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredQuestions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index + 1}
                showAnswer={showAnswers[question.id] || false}
                onToggleAnswer={() => toggleAnswer(question.id)}
              />
            ))}
          </div>
        )}

        {/* Pagination or Load More */}
        {filteredQuestions.length > 0 && (
          <div className="mt-8 text-center">
            <div className="text-gray-600 mb-4">
              Showing {filteredQuestions.length} of {questions.length} questions
            </div>
            {filteredQuestions.length < questions.length && (
              <button
                onClick={() => {
                  // Implement load more logic if paginated
                  fetchQuestions();
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Load More Questions
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}