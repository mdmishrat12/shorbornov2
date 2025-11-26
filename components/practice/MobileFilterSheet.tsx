"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"
import { usePractice } from "@/hooks/usePractice"
import { SubjectFilter } from "./filters/SubjectFilter"
import { TopicFilter } from "./filters/TopicFilter"
import { BCSExamFilter } from "./filters/BCSExamFilter"
import { DifficultyFilter } from "./filters/DifficultyFilter"

export function MobileFilterSheet() {
  const { activeFilterCount, clearAllFilters } = usePractice()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden fixed bottom-20 right-4 z-50 shadow-lg">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 sm:w-96 overflow-y-auto">
        <SheetHeader className="flex-row items-center justify-between space-y-0 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </SheetTitle>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 text-xs">
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </SheetHeader>

        <div className="space-y-6 py-4">
          <SubjectFilter />
          <TopicFilter />
          <DifficultyFilter />
          <BCSExamFilter />
        </div>
      </SheetContent>
    </Sheet>
  )
}