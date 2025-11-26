import { Card, CardContent } from "@/components/ui/card"
import { Target, Clock, TrendingUp, Users } from "lucide-react"

const stats = [
  {
    icon: Target,
    label: "Exams Taken",
    value: "24",
    change: "+5",
    color: "text-blue-600"
  },
  {
    icon: Clock,
    label: "Study Time",
    value: "48h",
    change: "+12h",
    color: "text-green-600"
  },
  {
    icon: TrendingUp,
    label: "Accuracy",
    value: "72%",
    change: "+3%",
    color: "text-orange-600"
  },
  {
    icon: Users,
    label: "Rank",
    value: "#156",
    change: "↑8",
    color: "text-purple-600"
  }
]

export function ExamStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.label}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <span className="text-sm font-medium text-green-600">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}