"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"
import { usePractice } from "@/hooks/usePractice"
import { SubjectFilter } from "./filters/SubjectFilter"
import { TopicFilter } from "./filters/TopicFilter"
import { WeakTopicsFilter } from "./filters/WeakTopicsFilter"
import { BCSExamFilter } from "./filters/BCSExamFilter"
import { DifficultyFilter } from "./filters/DifficultyFilter"
import { QuestionTypeFilter } from "./filters/QuestionTypeFilter"

const quickFilters = [
  { label: "Weak Topics", value: "weak_topics", color: "bg-red-100 text-red-700" },
  { label: "Unattempted", value: "unattempted", color: "bg-blue-100 text-blue-700" },
  { label: "Marked", value: "marked", color: "bg-yellow-100 text-yellow-700" },
  { label: "Incorrect", value: "incorrect", color: "bg-orange-100 text-orange-700" },
  { label: "Time Consuming", value: "time_consuming", color: "bg-purple-100 text-purple-700" }
]

export function FilterSidebar() {
  const { 
    selectedFilters, 
    toggleQuickFilter, 
    clearAllFilters,
    activeFilterCount 
  } = usePractice()

  return (
    <Card className="sticky top-24 border-0 shadow-lg">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5 text-blue-600" />
            Filters
          </CardTitle>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 text-xs">
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        {activeFilterCount > 0 && (
          <p className="text-sm text-gray-600">{activeFilterCount} filter(s) applied</p>
        )}
      </CardHeader>

      <CardContent className="space-y-6 p-4">
        {/* Quick Filters */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-gray-900">Quick Filters</h3>
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <Badge
                key={filter.value}
                variant={selectedFilters.quickFilters?.includes(filter.value) ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  selectedFilters.quickFilters?.includes(filter.value) 
                    ? filter.color 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => toggleQuickFilter(filter.value)}
              >
                {filter.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Subject Filter */}
        <SubjectFilter />

        {/* Topic Filter */}
        <TopicFilter />

        {/* Weak Topics Filter */}
        <WeakTopicsFilter />

        {/* BCS Exam Filter */}
        <BCSExamFilter />

        {/* Difficulty Filter */}
        <DifficultyFilter />

        {/* Question Type Filter */}
        <QuestionTypeFilter />
      </CardContent>
    </Card>
  )
}