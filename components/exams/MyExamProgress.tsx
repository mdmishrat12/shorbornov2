"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Calendar,
  Award,
  Zap
} from "lucide-react"

const progressData = {
  overall: 68,
  monthlyGoal: 12,
  monthlyCompleted: 8,
  streak: 7,
  nextMilestone: "Complete 10 exams this month",
  recentPerformance: [
    { subject: "Bangla", score: 72, improvement: 5 },
    { subject: "English", score: 68, improvement: -2 },
    { subject: "Math", score: 75, improvement: 8 },
    { subject: "GK", score: 65, improvement: 3 }
  ]
}

export function MyExamProgress() {
  const progressPercentage = (progressData.monthlyCompleted / progressData.monthlyGoal) * 100

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          My Exam Progress
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="text-3xl font-bold text-gray-900">{progressData.overall}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
          </div>
          <Progress value={progressData.overall} className="h-2 bg-blue-100" />
        </div>

        {/* Monthly Goal */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Monthly Goal</span>
            <span className="text-blue-600 font-bold">
              {progressData.monthlyCompleted}/{progressData.monthlyGoal} exams
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>{progressData.nextMilestone}</span>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Zap className="h-3 w-3 mr-1" />
              {progressData.streak} day streak
            </Badge>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-gray-900">Subject Performance</h4>
          <div className="space-y-2">
            {progressData.recentPerformance.map((subject, index) => (
              <div key={subject.subject} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{subject.subject}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    subject.improvement >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {subject.score}%
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      subject.improvement >= 0 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {subject.improvement >= 0 ? '+' : ''}{subject.improvement}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Target className="h-3 w-3 mr-1" />
            Set Goal
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}