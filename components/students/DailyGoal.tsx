"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Target, Clock, CheckCircle2 } from "lucide-react"
import { useState } from "react"

export function DailyGoal() {
  const [dailyProgress, setDailyProgress] = useState(65) // 65% completed

  const goals = [
    { name: "50 Questions", completed: true },
    { name: "2 Hours Study", completed: true },
    { name: "1 Model Test", completed: false },
    { name: "Weak Topic Review", completed: false }
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Daily Goal
            </CardTitle>
            <CardDescription>Your daily study target</CardDescription>
          </div>
          <span className="text-sm font-medium text-blue-600">{dailyProgress}%</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={dailyProgress} className="h-2" />
        
        <div className="grid grid-cols-2 gap-2">
          {goals.map((goal, index) => (
            <div key={index} className="flex items-center gap-2 p-2 rounded-lg border">
              {goal.completed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Clock className="h-4 w-4 text-gray-400" />
              )}
              <span className={`text-sm ${goal.completed ? 'text-green-600' : 'text-gray-600'}`}>
                {goal.name}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <Button className="flex-1" size="sm">
            Start Practice
          </Button>
          <Button variant="outline" size="sm">
            Adjust Goals
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}