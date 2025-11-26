
import { FilterSidebar } from "@/components/practice/FilterSidebar"
import { QuestionGrid } from "@/components/practice/QuestionGrid"
import { MobileFilterSheet } from "@/components/practice/MobileFilterSheet"
import { PracticeHeader } from "@/components/practice/PractiveHeader"

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <PracticeHeader />
      
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar - Hidden on mobile */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <QuestionGrid />
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <MobileFilterSheet />
    </div>
  )
}