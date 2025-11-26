"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { usePractice } from "@/hooks/usePractice"
import { Badge } from "@/components/ui/badge"
import { Circle, CheckSquare, FileText, Image } from "lucide-react"

const questionTypes = [
  {
    value: "single",
    label: "Single Correct",
    description: "Choose one correct answer from multiple options",
    icon: Circle,
    count: 2156,
    color: "text-blue-600"
  },
  {
    value: "multiple",
    label: "Multiple Correct", 
    description: "Choose multiple correct answers",
    icon: CheckSquare,
    count: 843,
    color: "text-green-600"
  },
  {
    value: "descriptive",
    label: "Descriptive",
    description: "Write detailed answers (for practice)",
    icon: FileText,
    count: 327,
    color: "text-purple-600"
  },
  {
    value: "image_based",
    label: "Image Based",
    description: "Questions with diagrams, charts, or images",
    icon: Image,
    count: 156,
    color: "text-orange-600"
  }
]

export function QuestionTypeFilter() {
  const { selectedFilters, toggleFilter } = usePractice()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-900">Question Type</h3>
        {selectedFilters.questionTypes.length > 0 && (
          <span className="text-xs text-blue-600 font-medium">
            {selectedFilters.questionTypes.length} selected
          </span>
        )}
      </div>

      <div className="space-y-3">
        {questionTypes.map((type) => {
          const isSelected = selectedFilters.questionTypes.includes(type.value)
          const Icon = type.icon

          return (
            <div
              key={type.value}
              className={`
                relative p-3 rounded-lg border cursor-pointer transition-all
                ${isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-gray-300'}
              `}
              onClick={() => toggleFilter('questionTypes', type.value)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`
                    flex h-8 w-8 items-center justify-center rounded-full mt-0.5
                    ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}
                  `}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Label className="font-semibold text-sm cursor-pointer">
                        {type.label}
                      </Label>
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                        {type.count}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                </div>
                
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleFilter('questionTypes', type.value)}
                  className="ml-2 mt-0.5"
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="pt-2 border-t">
        <div className="flex justify-between items-center">
          <button
            onClick={() => questionTypes.forEach(type => toggleFilter('questionTypes', type.value))}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {selectedFilters.questionTypes.length === questionTypes.length ? 'Deselect All' : 'Select All'}
          </button>
          {selectedFilters.questionTypes.length > 0 && (
            <button
              onClick={() => {
                // Keep only single correct type
                selectedFilters.questionTypes.forEach(type => {
                  if (type !== 'single') toggleFilter('questionTypes', type)
                })
              }}
              className="text-xs text-gray-600 hover:text-gray-700"
            >
              MCQs Only
            </button>
          )}
        </div>
      </div>
    </div>
  )
}