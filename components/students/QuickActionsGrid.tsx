import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, FileText, Clock, Award, Brain, BookOpen } from "lucide-react"

const quickActions = [
  {
    title: "Quick Practice",
    description: "20 questions",
    icon: Play,
    color: "from-blue-500 to-blue-600",
    time: "15 mins",
    href: "/student/practice"
  },
  {
    title: "Model Test",
    description: "Full BCS pattern",
    icon: FileText,
    color: "from-green-500 to-green-600",
    time: "2 hours",
    href: "/student/exams"
  },
  {
    title: "Quiz",
    description: "Subject wise",
    icon: Brain,
    color: "from-orange-500 to-orange-600",
    time: "30 mins",
    href: "/student/quiz"
  },
  {
    title: "Study",
    description: "Materials",
    icon: BookOpen,
    color: "from-purple-500 to-purple-600",
    time: "Flexible",
    href: "/student/study"
  }
]

export function QuickActionsGrid() {
  return (
    <Card className="border-0 shadow-lg lg:shadow-xl bg-gradient-to-br from-white to-cyan-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-cyan-600" />
          Quick Actions
        </CardTitle>
        <CardDescription>Jump right into practice</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            className={`h-auto p-3 lg:p-4 flex flex-col items-center gap-2 bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            asChild
          >
            <a href={action.href}>
              <action.icon className="h-5 w-5 lg:h-6 lg:w-6" />
              <div className="text-center">
                <div className="font-bold text-xs lg:text-sm leading-tight">{action.title}</div>
                <div className="text-xs opacity-90 mt-1">{action.time}</div>
              </div>
            </a>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}