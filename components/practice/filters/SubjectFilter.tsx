"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { usePractice } from "@/hooks/usePractice"

const subjects = [
  "Bangla",
  "English", 
  "Bangla Literature",
  "English Literature",
  "Math",
  "General Knowledge",
  "Geography",
  "Science",
  "Computer & IT",
  "International Affairs",
  "Bangladesh Affairs"
]

export function SubjectFilter() {
  const { selectedFilters, toggleFilter } = usePractice()

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-gray-900">Subjects</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {subjects.map((subject) => (
          <div key={subject} className="flex items-center space-x-2">
            <Checkbox
              id={`subject-${subject}`}
              checked={selectedFilters.subjects.includes(subject)}
              onCheckedChange={() => toggleFilter('subjects', subject)}
            />
            <Label
              htmlFor={`subject-${subject}`}
              className="text-sm font-normal cursor-pointer"
            >
              {subject}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}