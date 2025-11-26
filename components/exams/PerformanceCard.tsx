import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, AlertCircle } from "lucide-react"

const subjects = [
  { name: "Bangla", score: 72, improvement: 5, target: 80 },
  { name: "English", score: 68, improvement: -2, target: 75 },
  { name: "Mathematics", score: 75, improvement: 8, target: 80 },
  { name: "General Knowledge", score: 65, improvement: 3, target: 75 }
]

export function PerformanceCard() {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Monthly Goal</span>
            <span className="text-sm font-semibold text-gray-900">8/12 exams</span>
          </div>
          <Progress value={66} className="h-2" />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>66% completed</span>
            <span>4 remaining</span>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 text-sm">Subject Scores</h4>
          {subjects.map((subject) => (
            <div key={subject.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{subject.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
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
              <Progress 
                value={(subject.score / subject.target) * 100} 
                className="h-1"
              />
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="pt-4 border-t">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900">Focus on English</p>
              <p className="text-xs text-blue-700">Accuracy dropped by 2% this week</p>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          View Detailed Analytics
        </Button>
      </CardContent>
    </Card>
  )
}