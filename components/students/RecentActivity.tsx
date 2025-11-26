import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, TrendingUp } from "lucide-react"

const activities = [
  {
    id: 1,
    title: "BCS Model Test - 40th",
    type: "Full Test",
    score: 72,
    total: 100,
    date: "2 hours ago",
    duration: "2h 15m",
    improvement: "+5"
  },
  {
    id: 2,
    title: "Bangla Literature Practice",
    type: "Subject Test",
    score: 85,
    total: 100,
    date: "5 hours ago",
    duration: "45m",
    improvement: "+2"
  },
  {
    id: 3,
    title: "English Grammar Quiz",
    type: "Quick Test",
    score: 68,
    total: 100,
    date: "Yesterday",
    duration: "30m",
    improvement: "-3"
  },
  {
    id: 4,
    title: "General Knowledge Assessment",
    type: "Subject Test",
    score: 78,
    total: 100,
    date: "2 days ago",
    duration: "1h 10m",
    improvement: "+8"
  }
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest test attempts and progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm">{activity.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.duration}
                </span>
                <span>{activity.date}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{activity.score}</span>
                <span className="text-gray-500 text-sm">/ {activity.total}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs ${
                activity.improvement.startsWith('+') 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                <TrendingUp className="h-3 w-3" />
                {activity.improvement}%
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}