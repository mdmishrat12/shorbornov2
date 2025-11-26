"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Target, CheckCircle2, Clock, Star } from "lucide-react"
import { useState } from "react"

export function DailyGoalCard() {
  const [progress, setProgress] = useState(65)

  const goals = [
    { name: "50 Questions", completed: true, points: 10 },
    { name: "2 Hours Study", completed: true, points: 15 },
    { name: "1 Model Test", completed: false, points: 25 },
    { name: "Weak Topic Review", completed: false, points: 20 }
  ]

  const completedGoals = goals.filter(goal => goal.completed).length
  const totalPoints = goals.reduce((acc, goal) => acc + (goal.completed ? goal.points : 0), 0)

  return (
    <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full -translate-y-12 translate-x-12"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-cyan-100 rounded-full translate-y-8 -translate-x-8"></div>
      
      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Daily Goals</CardTitle>
              <CardDescription>Complete tasks to earn points</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm font-bold text-blue-600">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {totalPoints} pts
            </div>
            <div className="text-xs text-gray-500">{completedGoals}/{goals.length} completed</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Overall Progress</span>
            <span className="font-bold text-blue-600">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-blue-100" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {goals.map((goal, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                goal.completed 
                  ? 'border-green-200 bg-green-50 scale-101' 
                  : 'border-gray-200 bg-white hover:border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {goal.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Clock className="h-5 w-5 text-gray-400" />
                )}
                <span className="text-xs font-bold text-blue-600">+{goal.points}</span>
              </div>
              <div className={`text-sm font-medium ${
                goal.completed ? 'text-green-700' : 'text-gray-700'
              }`}>
                {goal.name}
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg">
          Start Practicing
        </Button>
      </CardContent>
    </Card>
  )
}