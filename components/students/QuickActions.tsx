import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, FileText, Clock, Award } from "lucide-react"

const quickActions = [
  {
    title: "Start Practice",
    description: "Subject-wise questions",
    icon: Play,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    href: "/student/practice"
  },
  {
    title: "Model Test",
    description: "Full BCS pattern",
    icon: FileText,
    color: "text-green-600",
    bgColor: "bg-green-50",
    href: "/student/exams"
  },
  {
    title: "Quick Quiz",
    description: "20 questions, 15 mins",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    href: "/student/quiz"
  },
  {
    title: "Leaderboard",
    description: "See your rank",
    icon: Award,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    href: "/student/leaderboard"
  }
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Quick Actions</CardTitle>
        <CardDescription>Jump right into practice</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-3 flex flex-col items-center gap-2 hover:shadow-md transition-all"
            asChild
          >
            <a href={action.href}>
              <div className={`p-2 rounded-full ${action.bgColor}`}>
                <action.icon className={`h-4 w-4 ${action.color}`} />
              </div>
              <div className="text-center">
                <div className="font-medium text-xs">{action.title}</div>
                <div className="text-xs text-gray-500">{action.description}</div>
              </div>
            </a>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}