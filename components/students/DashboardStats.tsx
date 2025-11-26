import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Clock, Award, Target } from "lucide-react"

const stats = [
  {
    title: "Total Practice",
    value: "1,247",
    description: "Questions attempted",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    title: "Study Time",
    value: "48h 12m",
    description: "This month",
    icon: Clock,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    title: "Accuracy",
    value: "72%",
    description: "Overall score",
    icon: Target,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    title: "Current Rank",
    value: "#156",
    description: "Among 5,000 students",
    icon: Award,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  }
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}