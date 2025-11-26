import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, Target, BookOpen } from "lucide-react"

const quickActions = [
  {
    icon: Play,
    title: "Quick Test",
    description: "20 questions, 15 minutes",
    time: "15 min"
  },
  {
    icon: Target,
    title: "Model Test", 
    description: "Full BCS pattern simulation",
    time: "120 min"
  },
  {
    icon: Clock,
    title: "Speed Test",
    description: "Improve solving speed",
    time: "30 min"
  },
  {
    icon: BookOpen,
    title: "Subject Test",
    description: "Focus on specific subjects", 
    time: "45 min"
  }
]

export function QuickActions() {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Quick Start</CardTitle>
        <p className="text-gray-600 text-sm">Jump right into practice</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3 border border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              >
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900 text-sm mb-1">
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {action.time}
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}