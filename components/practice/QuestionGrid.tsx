"use client"

import { useState } from "react"
import { usePractice } from "@/hooks/usePractice"
import { Button } from "@/components/ui/button"
import { RefreshCw, Filter } from "lucide-react"
import { QuestionCard } from "./QuestionCard"
import { NoQuestionsEmptyState } from "./NoQuestionsEmptyState"
import { SearchEmptyState } from "./SearchEmptyState"
import { QuestionSkeleton } from "./QuestionSkeleton"
import { EmptyState } from "./EmptyState"

export function QuestionGrid() {
  const { filteredQuestions, isLoading, loadMoreQuestions, hasMore, selectedFilters,  searchQuery,
    hasSearchResults,
    isEmptyBank,
    clearAllFilters  } = usePractice()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <QuestionSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (filteredQuestions.length === 0) {
    return <EmptyState filters={selectedFilters} />
  }

  

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <QuestionSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isEmptyBank) {
    return <NoQuestionsEmptyState />
  }

  if (hasSearchResults) {
    return (
      <SearchEmptyState 
        searchQuery={searchQuery}
        onClearSearch={() => { /* Clear search logic */ }}
        onBrowseAll={clearAllFilters}
      />
    )
  }

  if (filteredQuestions.length === 0) {
    return <EmptyState filters={selectedFilters} />
  }


  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {filteredQuestions.length} questions found
          </h2>
          <p className="text-sm text-gray-600">Practice makes perfect!</p>
        </div>

        {/* View Toggle
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div> */}
      </div>

      {/* Questions Grid */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <QuestionCard 
            key={question.id} 
            question={question} 
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button 
            onClick={loadMoreQuestions} 
            variant="outline" 
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Load More Questions
          </Button>
        </div>
      )}
    </div>
  )
}