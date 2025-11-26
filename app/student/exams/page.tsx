import { ExamList } from "@/components/exams/ExamLists"
import { ExamHeader } from "@/components/exams/ExamsHeader"
import { ExamStats } from "@/components/exams/ExamStats"
import { PerformanceCard } from "@/components/exams/PerformanceCard"
import { QuickActions } from "@/components/exams/QuicaActions"

export default function ExamsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <ExamHeader />
        
        {/* Stats */}
        <div className="mt-8">
          <ExamStats />
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <QuickActions />
            <ExamList />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            <PerformanceCard />
          </div>
        </div>
      </div>
    </div>
  )
}