"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, GraduationCap, Calendar } from "lucide-react"
import { usePractice } from "@/hooks/usePractice"
import { Badge } from "@/components/ui/badge"

// BCS exam data
const bcsExams = [
  { year: 44, cadre: "General", questions: 245, date: "2024" },
  { year: 43, cadre: "General", questions: 238, date: "2023" },
  { year: 42, cadre: "General", questions: 231, date: "2022" },
  { year: 41, cadre: "General", questions: 225, date: "2021" },
  { year: 40, cadre: "General", questions: 218, date: "2020" },
  { year: 39, cadre: "General", questions: 210, date: "2019" },
  { year: 38, cadre: "General", questions: 205, date: "2018" },
  { year: 37, cadre: "General", questions: 198, date: "2017" },
  { year: 36, cadre: "General", questions: 192, date: "2016" },
  { year: 35, cadre: "General", questions: 185, date: "2015" },
  { year: 44, cadre: "Technical", questions: 156, date: "2024" },
  { year: 43, cadre: "Technical", questions: 148, date: "2023" },
  { year: 42, cadre: "Technical", questions: 142, date: "2022" }
]

export function BCSExamFilter() {
  const { selectedFilters, toggleFilter } = usePractice()
  const [searchQuery, setSearchQuery] = useState("")
  const [showAll, setShowAll] = useState(false)

  const filteredExams = bcsExams.filter(exam => 
    exam.year.toString().includes(searchQuery) ||
    exam.cadre.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const displayExams = showAll ? filteredExams : filteredExams.slice(0, 6)

  const getExamId = (exam: typeof bcsExams[0]) => `${exam.year}-${exam.cadre}`

  const clearSearch = () => setSearchQuery("")

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-blue-600" />
          BCS Exams
        </h3>
        {selectedFilters.bcsExams.length > 0 && (
          <span className="text-xs text-blue-600 font-medium">
            {selectedFilters.bcsExams.length} selected
          </span>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by year or cadre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-8 text-sm"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Exams List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {displayExams.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            No BCS exams found
          </div>
        ) : (
          <>
            {displayExams.map((exam) => {
              const examId = getExamId(exam)
              const isSelected = selectedFilters.bcsExams.includes(examId)

              return (
                <div
                  key={examId}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Checkbox
                    id={`bcs-${examId}`}
                    checked={isSelected}
                    onCheckedChange={() => toggleFilter('bcsExams', examId)}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Label
                        htmlFor={`bcs-${examId}`}
                        className="font-medium text-sm cursor-pointer truncate"
                      >
                        BCS {exam.year} - {exam.cadre}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {exam.questions} Qs
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{exam.date}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </>
        )}

        {/* Show More/Less Toggle */}
        {filteredExams.length > 6 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="w-full text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            {showAll ? `Show Less` : `Show More (${filteredExams.length - 6} more)`}
          </Button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="pt-2 border-t">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Select all general cadre exams
              bcsExams
                .filter(exam => exam.cadre === "General")
                .forEach(exam => toggleFilter('bcsExams', getExamId(exam)))
            }}
            className="text-xs h-7"
          >
            All General
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Select recent 3 years
              bcsExams
                .slice(0, 3)
                .forEach(exam => toggleFilter('bcsExams', getExamId(exam)))
            }}
            className="text-xs h-7"
          >
            Recent 3 Years
          </Button>
          {selectedFilters.bcsExams.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectedFilters.bcsExams.forEach(examId => toggleFilter('bcsExams', examId))}
              className="text-xs h-7 text-red-600 hover:text-red-700"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}