"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  Users, 
  Bell,
  Plus
} from "lucide-react"

const upcomingExams = [
  {
    id: 1,
    title: "Weekly Live Challenge",
    date: "Today, 8:00 PM",
    participants: 1247,
    duration: "90 mins",
    type: "competitive",
    reminder: true
  },
  {
    id: 2,
    title: "Bangla Literature Test",
    date: "Tomorrow, 6:00 PM",
    participants: 856,
    duration: "60 mins",
    type: "subject",
    reminder: false
  },
  {
    id: 3,
    title: "Full Model Test - BCS 43rd",
    date: "Dec 28, 10:00 AM",
    participants: 943,
    duration: "120 mins",
    type: "model",
    reminder: true
  }
]

export function UpcomingExams() {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
            Upcoming Exams
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {upcomingExams.map((exam) => (
          <div
            key={exam.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 flex-shrink-0">
              <Calendar className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm text-gray-900 truncate">
                  {exam.title}
                </h4>
                <Badge 
                  variant="outline" 
                  className={`
                    text-xs ${
                      exam.type === 'competitive' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      exam.type === 'subject' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }
                  `}
                >
                  {exam.type}
                </Badge>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{exam.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{exam.participants.toLocaleString()} participants</span>
                  <span>•</span>
                  <span>{exam.duration}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-shrink-0">
              {exam.reminder ? (
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Bell className="h-3 w-3 mr-1" />
                  Set
                </Button>
              ) : (
                <Button size="sm" className="h-7 text-xs">
                  Join
                </Button>
              )}
            </div>
          </div>
        ))}

        <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          View All Scheduled Exams
        </Button>
      </CardContent>
    </Card>
  )
}