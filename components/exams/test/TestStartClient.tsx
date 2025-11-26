"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  Target, 
  Users, 
  Star, 
  BookOpen,
  AlertTriangle,
  Play,
  ArrowLeft
} from "lucide-react"

const examData = {
  id: "1",
  title: "BCS 44th Preliminary Simulation",
  description: "Complete mock test based on the latest BCS preliminary exam pattern. This test includes questions from all major subjects with time constraints similar to the actual exam.",
  duration: 120,
  questions: 200,
  totalMarks: 200,
  negativeMarking: true,
  subjects: [
    { name: "Bangla", questions: 35, marks: 35 },
    { name: "English", questions: 35, marks: 35 },
    { name: "Bangladesh Affairs", questions: 30, marks: 30 },
    { name: "International Affairs", questions: 20, marks: 20 },
    { name: "General Science", questions: 15, marks: 15 },
    { name: "Computer & IT", questions: 15, marks: 15 },
    { name: "Mental Skills", questions: 50, marks: 50 }
  ],
  instructions: [
    "Total time allocated for this test is 120 minutes (2 hours)",
    "The test contains 200 multiple choice questions",
    "Each question carries 1 mark",
    "There is negative marking of 0.25 for each wrong answer",
    "You cannot go back to previous questions once answered",
    "The test will auto-submit when time expires",
    "Use the question palette to navigate between questions",
    "You can mark questions for review and come back later"
  ],
  participants: 2547,
  rating: 4.8,
  difficulty: "Advanced"
}

export function TestStartClient({ examId }: { examId: string }) {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)

  const handleStartTest = () => {
    setIsStarting(true)
    // Simulate loading
    setTimeout(() => {
      router.push(`/student/exams/${examId}/test`)
    }, 1500)
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Exams
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Exam Instructions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please read the instructions carefully before starting the test
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exam Overview Card */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {examData.title}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {examData.description}
                    </p>
                  </div>
                  <Badge className={`${
                    examData.difficulty === 'Advanced' 
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : 'bg-green-100 text-green-800 border-green-200'
                  }`}>
                    {examData.difficulty}
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">{examData.duration}m</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">{examData.questions}</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Star className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">{examData.totalMarks}</div>
                    <div className="text-sm text-gray-600">Total Marks</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Users className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-900">{examData.participants}</div>
                    <div className="text-sm text-gray-600">Participants</div>
                  </div>
                </div>

                {/* Subject Distribution */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Subject Distribution
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {examData.subjects.map((subject, index) => (
                      <div key={subject.name} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-900">{subject.name}</div>
                        <div className="text-sm text-gray-600">
                          {subject.questions} Qs • {subject.marks} M
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Instructions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Important Instructions
                  </h3>
                  <div className="space-y-3">
                    {examData.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mt-0.5 flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Start Test Card */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white sticky top-8">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Ready to Start?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Make sure you have {examData.duration} minutes of uninterrupted time
                  </p>

                  <Button
                    onClick={handleStartTest}
                    disabled={isStarting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold shadow-lg"
                  >
                    {isStarting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Starting Test...
                      </div>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Start Test Now
                      </>
                    )}
                  </Button>

                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 text-yellow-800 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Time-bound test</span>
                    </div>
                    <p className="text-yellow-700 text-xs mt-1">
                      Once started, the timer cannot be paused
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Tips</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span>Read questions carefully before answering</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span>Manage your time effectively across sections</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span>Use the mark feature for difficult questions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span>Review marked questions before submitting</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}