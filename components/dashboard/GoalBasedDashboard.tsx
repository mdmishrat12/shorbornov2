"use client"

import { useState, useEffect } from "react"
import { StudyPlanDashboard } from "./StudyPlanDashboard"
import { GoalSetupWizard } from "./GoalSetupWizard"
import { useUser } from "@/hooks/useUser"
export function GoalBasedDashboard() {
  const { user, isLoading } = useUser()
  const [hasGoal, setHasGoal] = useState(false)

  useEffect(() => {
    // Check if user has set a goal
    if (user?.goal) {
      setHasGoal(true)
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {hasGoal ? <StudyPlanDashboard /> : <GoalSetupWizard />}
    </div>
  )
}