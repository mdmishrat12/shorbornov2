import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { AlertTriangle, BookOpen } from "lucide-react"

const weakTopics = [
  { name: "International Affairs", accuracy: 45, questions: 120 },
  { name: "Bangla Literature", accuracy: 52, questions: 95 },
  { name: "Computer & IT", accuracy: 58, questions: 80 },
  { name: "Geography", accuracy: 62, questions: 110 }
]

export function WeakTopics() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          Weak Topics
        </CardTitle>
        <CardDescription>Areas needing improvement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {weakTopics.map((topic, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{topic.name}</span>
              <span className="text-xs text-gray-500">{topic.accuracy}%</span>
            </div>
            <Progress value={topic.accuracy} className="h-1" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{topic.questions} questions</span>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                Practice
              </Button>
            </div>
          </div>
        ))}
        
        <Button variant="outline" className="w-full" size="sm">
          View All Weak Areas
        </Button>
      </CardContent>
    </Card>
  )
}