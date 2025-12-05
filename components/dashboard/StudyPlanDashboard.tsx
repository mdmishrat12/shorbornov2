"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Target, 
  BookOpen, 
  TrendingUp, 
  Zap,
  Clock,
  Award,
  BarChart3,
  Play,
  Calendar,
  Lightbulb
} from "lucide-react"
import { DiagnosticTest } from "./DiagnosticTest"

// Mock data based on user's goal
const studyData = {
  goal: {
    type: "BCS",
    cadre: "Administration Cadre",
    startDate: "2024-01-15",
    targetDate: "2024-12-31"
  },
  subjects: [
    { name: "Bangla", totalMarks: 35, completed: 45, importance: "high", priority: 1 },
    { name: "English", totalMarks: 35, completed: 38, importance: "high", priority: 2 },
    { name: "Bangladesh Affairs", totalMarks: 30, completed: 52, importance: "high", priority: 3 },
    { name: "International Affairs", totalMarks: 20, completed: 28, importance: "medium", priority: 4 },
    { name: "General Science", totalMarks: 15, completed: 65, importance: "medium", priority: 5 },
    { name: "Computer & IT", totalMarks: 15, completed: 42, importance: "medium", priority: 6 },
    { name: "Mental Skills", totalMarks: 50, completed: 68, importance: "high", priority: 7 }
  ],
  preparationLevel: {
    easy: 85,    // Score in easy diagnostic test
    medium: 62,  // Score in medium diagnostic test  
    hard: 45,    // Score in hard diagnostic test
    overall: 45  // Calculated preparation percentage
  },
  weeklyPlan: [
    { day: "Mon", subjects: ["Bangla", "English"], hours: 3 },
    { day: "Tue", subjects: ["Bangladesh Affairs", "International Affairs"], hours: 4 },
    { day: "Wed", subjects: ["General Science", "Computer & IT"], hours: 3 },
    { day: "Thu", subjects: ["Mental Skills", "Practice Test"], hours: 5 },
    { day: "Fri", subjects: ["Weak Area Revision"], hours: 3 },
    { day: "Sat", subjects: ["Full Mock Test"], hours: 6 },
    { day: "Sun", subjects: ["Review & Planning"], hours: 2 }
  ],
  importantTopics: [
    { topic: "Bangla Literature", subject: "Bangla", expectedMarks: 8, completion: 65 },
    { topic: "English Grammar", subject: "English", expectedMarks: 10, completion: 72 },
    { topic: "Liberation War", subject: "Bangladesh Affairs", expectedMarks: 6, completion: 58 },
    { topic: "Current International Affairs", subject: "International Affairs", expectedMarks: 5, completion: 42 },
    { topic: "Basic Computer Concepts", subject: "Computer & IT", expectedMarks: 4, completion: 68 }
  ]
}

export function StudyPlanDashboard() {
  const [showDiagnostic, setShowDiagnostic] = useState(false)
  const [preparationLevel, setPreparationLevel] = useState(0)

  useEffect(() => {
    // Calculate overall preparation level based on diagnostic tests
    const { easy, medium, hard } = studyData.preparationLevel
    let level = 0
    
    if (easy >= 80) level += 20
    if (medium >= 70) level += 30  
    if (hard >= 60) level += 50
    
    setPreparationLevel(level)
  }, [])

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return "bg-red-100 text-red-700 border-red-200"
    if (priority <= 4) return "bg-orange-100 text-orange-700 border-orange-200"
    return "bg-blue-100 text-blue-700 border-blue-200"
  }

  const getImportanceIcon = (importance: string) => {
    if (importance === "high") return <Zap className="h-4 w-4 text-red-500" />
    if (importance === "medium") return <TrendingUp className="h-4 w-4 text-orange-500" />
    return <BookOpen className="h-4 w-4 text-blue-500" />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Study Plan</h1>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {studyData.goal.type} - {studyData.goal.cadre}
              </Badge>
            </div>
            <p className="text-gray-600">
              Personalized preparation roadmap based on your diagnostic assessment
            </p>
          </div>
          
          <Button 
            onClick={() => setShowDiagnostic(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Take Diagnostic Test
          </Button>
        </div>

        {/* Preparation Level Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{preparationLevel}%</div>
                <div className="text-gray-600">Preparation Level</div>
                <Progress value={preparationLevel} className="h-2 mt-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {studyData.preparationLevel.easy}%
                </div>
                <div className="text-gray-600">Easy Level</div>
                <Badge variant="outline" className="bg-green-50 text-green-700 mt-2">
                  {studyData.preparationLevel.easy >= 80 ? "Mastered" : "Learning"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {studyData.preparationLevel.medium}%
                </div>
                <div className="text-gray-600">Medium Level</div>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 mt-2">
                  {studyData.preparationLevel.medium >= 70 ? "Proficient" : "Practicing"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {studyData.preparationLevel.hard}%
                </div>
                <div className="text-gray-600">Hard Level</div>
                <Badge variant="outline" className="bg-red-50 text-red-700 mt-2">
                  {studyData.preparationLevel.hard >= 60 ? "Advanced" : "Needs Work"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="subjects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subjects" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Subjects
            </TabsTrigger>
            <TabsTrigger value="topics" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Important Topics
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Weekly Plan
            </TabsTrigger>
          </TabsList>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {studyData.subjects.map((subject) => (
                <Card key={subject.name} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getImportanceIcon(subject.importance)}
                        <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                      </div>
                      <Badge className={getPriorityColor(subject.priority)}>
                        Priority {subject.priority}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Completion</span>
                          <span className="font-semibold text-gray-900">{subject.completed}%</span>
                        </div>
                        <Progress value={subject.completed} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Total Marks: {subject.totalMarks}</span>
                        <span>Importance: {subject.importance}</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-4">
                      <Play className="h-4 w-4 mr-2" />
                      Start Practice
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Important Topics Tab */}
          <TabsContent value="topics" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  High-Value Topics
                </CardTitle>
                <CardDescription>
                  Focus on these topics for maximum marks based on previous year analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studyData.importantTopics.map((topic, index) => (
                    <div key={topic.topic} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{topic.topic}</h4>
                            <Badge variant="outline" className="bg-gray-100">
                              {topic.subject}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Expected Marks: {topic.expectedMarks}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right min-w-32">
                        <div className="text-lg font-bold text-gray-900">{topic.completion}%</div>
                        <Progress value={topic.completion} className="h-2 w-20 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weekly Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyData.weeklyPlan.map((day) => (
                <Card key={day.day} className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span>{day.day}</span>
                      <Badge variant="outline" className="bg-blue-50">
                        {day.hours}h
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {day.subjects.map((subject, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">{subject}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Start Today's Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Diagnostic Test Modal */}
        {showDiagnostic && (
          <DiagnosticTest onClose={() => setShowDiagnostic(false)} />
        )}
      </div>
    </div>
  )
}