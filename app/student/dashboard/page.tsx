import { DailyGoalCard } from "@/components/students/DailyGoalCard";
import { QuickActionsGrid } from "@/components/students/QuickActionsGrid";
import { RecentActivity } from "@/components/students/RecentActivity";
import { StatsGrid } from "@/components/students/StatsGrid";
import { WeakTopics } from "@/components/students/WeakTopicsCard";
import { WelcomeHeader } from "@/components/students/WelcomeHeader";

export default function StudentDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <WelcomeHeader />

      {/* Stats Overview - Different grid for different screens */}
      <StatsGrid />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Daily Goal & Recent Tests */}
        <div className="xl:col-span-2 space-y-6">
          <DailyGoalCard />
          <RecentActivity />
        </div>
        
        {/* Right Column - Quick Actions & Weak Topics */}
        <div className="space-y-6">
          <QuickActionsGrid />
          <WeakTopics />
        </div>
      </div>
    </div>
  )
}