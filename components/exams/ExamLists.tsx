import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Users, Star } from "lucide-react"

const exams = [
  {
    id: 1,
    title: "BCS 44th Preliminary Simulation",
    description: "Complete mock test based on latest pattern",
    type: "model",
    difficulty: "Advanced",
    duration: 120,
    questions: 200,
    participants: 2547,
    rating: 4.8
  },
  {
    id: 2,
    title: "Bangla Literature Master Test",
    description: "Comprehensive coverage of Bangla literature",
    type: "subject", 
    difficulty: "Medium",
    duration: 60,
    questions: 100,
    participants: 1876,
    rating: 4.6
  },
  {
    id: 3,
    title: "English Grammar & Composition", 
    description: "Focus on grammar and writing skills",
    type: "subject",
    difficulty: "Medium",
    duration: 45,
    questions: 75,
    participants: 2314,
    rating: 4.7
  },
  {
    id: 4,
    title: "General Knowledge Challenge",
    description: "Current affairs and Bangladesh studies",
    type: "subject",
    difficulty: "Mixed", 
    duration: 50,
    questions: 80,
    participants: 1987,
    rating: 4.5
  }
]

export function ExamList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Exams</h2>
          <p className="text-gray-600">Choose from comprehensive exam library</p>
        </div>
        <Button variant="outline">View All</Button>
      </div>

      <div className="grid gap-6">
        {exams.map((exam) => (
          <Card key={exam.id} className="border border-gray-200 hover:border-gray-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {exam.title}
                    </h3>
                    <Badge 
                      variant="outline"
                      className={`
                        ${exam.difficulty === 'Advanced' ? 'bg-red-50 text-red-700 border-red-200' : 
                          'bg-orange-50 text-orange-700 border-orange-200'}
                      `}
                    >
                      {exam.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {exam.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>{exam.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-green-600" />
                      <span>{exam.participants.toLocaleString()} participants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-600 fill-yellow-400" />
                      <span>{exam.rating} rating</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[140px]">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Play className="h-4 w-4 mr-2" />
                    Start Exam
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}