"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Target, 
  Clock, 
  TrendingUp, 
  Zap,
  Star,
  Crown
} from "lucide-react"

const recommendations = [
  {
    id: 1,
    title: "Weak Area Focus: International Affairs",
    description: "Based on your performance, we recommend practicing International Affairs",
    reason: "Your accuracy is 45% in this topic",
    improvement: "+15% potential",
    priority: "high",
    duration: "45 mins",
    questions: 75
  },
  {
    id: 2,
    title: "Speed Improvement Test",
    description: "Practice to improve your question-solving speed",
    reason: "You spend 45s avg per question (target: 35s)",
    improvement: "+20% speed potential",
    priority: "medium",
    duration: "30 mins",
    questions: 50
  },
  {
    id: 3,
    title: "BCS 44th Pattern Mastery",
    description: "Latest exam pattern practice with current affairs",
    reason: "New pattern questions added",
    improvement: "Better preparation",
    priority: "medium",
    duration: "120 mins",
    questions: 200
  }
]

export function ExamRecommendations() {
  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-amber-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-orange-600" />
            Smart Recommendations
          </CardTitle>
          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
            <Zap className="h-3 w-3 mr-1" />
            AI Powered
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex items-start gap-4 p-4 rounded-xl bg-white border border-orange-200 hover:shadow-md transition-all"
          >
            {/* Priority Indicator */}
            <div className={`
              flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0
              ${rec.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}
            `}>
              <TrendingUp className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                  {rec.title}
                </h4>
                <Badge 
                  variant="outline"
                  className={`
                    text-xs ${
                      rec.priority === 'high' 
                        ? 'bg-red-50 text-red-700 border-red-200' 
                        : 'bg-orange-50 text-orange-700 border-orange-200'
                    }
                  `}
                >
                  {rec.priority} priority
                </Badge>
              </div>

              <p className="text-gray-600 text-sm mb-2">{rec.description}</p>

              <div className="space-y-2 text-xs">
                <div className="text-orange-700 font-medium">📊 {rec.reason}</div>
                <div className="text-green-600 font-medium">🎯 {rec.improvement}</div>
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{rec.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  <span>{rec.questions} questions</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              Start
            </Button>
          </div>
        ))}

        <div className="text-center pt-2">
          <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
            View All Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}