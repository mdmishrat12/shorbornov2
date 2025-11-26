"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { usePractice } from "@/hooks/usePractice"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, Award } from "lucide-react"

const difficulties = [
  {
    value: "easy",
    label: "Easy",
    description: "Basic concepts, high success rate",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: Target,
    count: 1247
  },
  {
    value: "medium", 
    label: "Medium",
    description: "Moderate difficulty, good for practice",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: TrendingUp,
    count: 856
  },
  {
    value: "hard",
    label: "Hard",
    description: "Advanced concepts, challenging questions",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: Award,
    count: 423
  }
]

export function DifficultyFilter() {
  const { selectedFilters, toggleFilter } = usePractice()

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-900">Difficulty Level</h3>
        {selectedFilters.difficulties.length > 0 && (
          <span className="text-xs text-blue-600 font-medium">
            {selectedFilters.difficulties.length} selected
          </span>
        )}
      </div>

      <div className="space-y-2">
        {difficulties.map((difficulty) => {
          const isSelected = selectedFilters.difficulties.includes(difficulty.value)
          const Icon = difficulty.icon

          return (
            <div
              key={difficulty.value}
              className={`
                relative p-3 rounded-lg border-2 cursor-pointer transition-all
                ${isSelected ? difficulty.color + ' border-current' : 'bg-white border-gray-200 hover:border-gray-300'}
              `}
              onClick={() => toggleFilter('difficulties', difficulty.value)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`
                    flex h-8 w-8 items-center justify-center rounded-full
                    ${isSelected ? 'bg-white text-current' : 'bg-gray-100 text-gray-600'}
                  `}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Label className="font-semibold text-sm cursor-pointer">
                        {difficulty.label}
                      </Label>
                      <Badge 
                        variant="secondary" 
                        className={`
                          text-xs ${isSelected ? 'bg-white text-current' : 'bg-gray-100 text-gray-600'}
                        `}
                      >
                        {difficulty.count}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {difficulty.description}
                    </p>
                  </div>
                </div>
                
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleFilter('difficulties', difficulty.value)}
                  className="ml-2"
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Select All */}
      {selectedFilters.difficulties.length > 0 && (
        <div className="pt-2 border-t">
          <button
            onClick={() => difficulties.forEach(d => toggleFilter('difficulties', d.value))}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            {selectedFilters.difficulties.length === difficulties.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      )}
    </div>
  )
}