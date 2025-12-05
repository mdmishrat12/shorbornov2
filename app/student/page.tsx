import RoleProtected from "@/components/protected/role-protected";
import { DailyGoal } from "@/components/students/DailyGoal";
import { DashboardStats } from "@/components/students/DashboardStats";
import { QuickActions } from "@/components/students/QuickActions";
import { RecentActivity } from "@/components/students/RecentActivity";
import { UpcomingExams } from "@/components/students/UpcomingExams";
import { WeakTopics } from "@/components/students/WeakTopicsCard";

export default function StudentDashboard() {
  return (
        <RoleProtected allowedRoles={['student', 'teacher', 'admin']}>

    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Ready for your BCS preparation?</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Today is</p>
            <p className="font-semibold text-gray-900">
              {new Date().toLocaleDateString('en-BD', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <DailyGoal />
            <RecentActivity />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <QuickActions />
            <WeakTopics />
            <UpcomingExams />
          </div>
        </div>
      </div>
    </div>
        </RoleProtected>

  )
}