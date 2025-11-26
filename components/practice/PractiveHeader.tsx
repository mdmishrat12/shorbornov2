"use client"

import { Filter, Search, SlidersHorizontal, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { usePractice } from "@/hooks/usePractice"

export function PracticeHeader() {
  const { 
    selectedFilters, 
    clearAllFilters, 
    totalQuestions,
    searchQuery,
    setSearchQuery
  } = usePractice()

  const activeFilterCount = Object.values(selectedFilters).filter(Boolean).length

  return (
    <div className="bg-white border-b sticky top-0 z-30">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Practice</h1>
                <p className="text-gray-600">
                  {totalQuestions.toLocaleString()} questions available
                </p>
              </div>
            </div>

            {/* Active Filters Badge */}
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 lg:flex-initial lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>

            {/* Mobile Filter Button */}
            <Button variant="outline" size="sm" className="lg:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Clear Filters */}
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}