import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Clock } from "lucide-react"

const upcomingExams = [
  {
    id: 1,
    title: "Weekly Challenge - BCS 40th Pattern",
    date: "Tomorrow, 10:00 AM",
    participants: "1.2k",
    duration: "2 hours",
    type: "competitive"
  },
  {
    id: 2,
    title: "Bangla Literature Master Test",
    date: "Dec 28, 2:00 PM",
    participants: "856",
    duration: "1 hour",
    type: "subject"
  }
]

export function UpcomingExams() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-blue-600" />
          Upcoming Tests
        </CardTitle>
        <CardDescription>Scheduled competitive tests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingExams.map((exam) => (
          <div key={exam.id} className="p-3 border rounded-lg space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-sm leading-tight">{exam.title}</h4>
              <Badge variant={exam.type === 'competitive' ? 'default' : 'secondary'} className="text-xs">
                {exam.type}
              </Badge>
            </div>
            
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {exam.date}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {exam.participants} participants
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {exam.duration}
              </div>
            </div>
            
            <Button size="sm" className="w-full text-xs">
              Set Reminder
            </Button>
          </div>
        ))}
        
        <Button variant="ghost" className="w-full" size="sm">
          View All Scheduled Tests
        </Button>
      </CardContent>
    </Card>
  )
}