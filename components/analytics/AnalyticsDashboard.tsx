"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Award, 
  BookOpen, 
  Zap,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Filter
} from "lucide-react"

// Mock data
const analyticsData = {
  overall: {
    totalExams: 24,
    totalQuestions: 4800,
    totalTime: "96h 30m",
    averageScore: 72.5,
    accuracy: 68.3,
    rank: 156,
    improvement: 8.2
  },
  subjectPerformance: [
    { subject: "Bangla", score: 78, accuracy: 75, timeSpent: "18h 30m", improvement: 5.2, trend: "up" },
    { subject: "English", score: 72, accuracy: 68, timeSpent: "22h 15m", improvement: 2.1, trend: "up" },
    { subject: "Mathematics", score: 85, accuracy: 82, timeSpent: "15h 45m", improvement: 12.5, trend: "up" },
    { subject: "General Knowledge", score: 65, accuracy: 62, timeSpent: "12h 20m", improvement: -1.3, trend: "down" },
    { subject: "Science", score: 70, accuracy: 67, timeSpent: "8h 45m", improvement: 3.8, trend: "up" },
    { subject: "Computer & IT", score: 68, accuracy: 65, timeSpent: "6h 35m", improvement: 6.7, trend: "up" }
  ],
  weeklyProgress: [
    { week: "Week 1", score: 65, accuracy: 62, exams: 3 },
    { week: "Week 2", score: 68, accuracy: 65, exams: 4 },
    { week: "Week 3", score: 71, accuracy: 68, exams: 5 },
    { week: "Week 4", score: 72, accuracy: 69, exams: 4 },
    { week: "Current", score: 75, accuracy: 72, exams: 3 }
  ],
  examHistory: [
    { id: 1, name: "BCS 44th Simulation", score: 78, date: "2024-01-15", timeSpent: "1:45:23", rank: 89 },
    { id: 2, name: "Bangla Literature Test", score: 82, date: "2024-01-12", timeSpent: "1:12:45", rank: 45 },
    { id: 3, name: "English Master Test", score: 71, date: "2024-01-10", timeSpent: "1:28:12", rank: 123 },
    { id: 4, name: "Math Challenge", score: 88, date: "2024-01-08", timeSpent: "1:35:47", rank: 34 },
    { id: 5, name: "GK Weekly Test", score: 65, date: "2024-01-05", timeSpent: "1:15:33", rank: 178 }
  ],
  weakAreas: [
    { topic: "International Affairs", accuracy: 45, questions: 120, improvement: -5 },
    { topic: "Bangladesh History", accuracy: 52, questions: 95, improvement: 2 },
    { topic: "English Vocabulary", accuracy: 58, questions: 80, improvement: 8 },
    { topic: "Physics Concepts", accuracy: 48, questions: 65, improvement: -2 }
  ],
  studyPattern: [
    { day: "Mon", hours: 3.5, exams: 2 },
    { day: "Tue", hours: 4.2, exams: 1 },
    { day: "Wed", hours: 2.8, exams: 3 },
    { day: "Thu", hours: 3.9, exams: 2 },
    { day: "Fri", hours: 2.5, exams: 1 },
    { day: "Sat", hours: 5.1, exams: 4 },
    { day: "Sun", hours: 4.3, exams: 3 }
  ]
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month")

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
            <p className="text-gray-600 mt-2">Track your progress and identify areas for improvement</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "week" as const, label: "Last Week" },
            { key: "month" as const, label: "Last Month" },
            { key: "all" as const, label: "All Time" }
          ].map((range) => (
            <Button
              key={range.key}
              variant={timeRange === range.key ? "default" : "outline"}
              onClick={() => setTimeRange(range.key)}
              className="flex-1 lg:flex-none"
            >
              {range.label}
            </Button>
          ))}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{analyticsData.overall.averageScore}%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">+{analyticsData.overall.improvement}%</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-100">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accuracy</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{analyticsData.overall.accuracy}%</p>
                  <div className="text-sm text-gray-600 mt-1">Overall</div>
                </div>
                <div className="p-3 rounded-lg bg-green-100">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Time Spent</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{analyticsData.overall.totalTime}</p>
                  <div className="text-sm text-gray-600 mt-1">Study Time</div>
                </div>
                <div className="p-3 rounded-lg bg-purple-100">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Rank</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">#{analyticsData.overall.rank}</p>
                  <div className="text-sm text-gray-600 mt-1">Top 7%</div>
                </div>
                <div className="p-3 rounded-lg bg-orange-100">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Subjects
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="weakness" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Weak Areas
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Progress */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Weekly Progress
                  </CardTitle>
                  <CardDescription>Your score improvement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.weeklyProgress.map((week, index) => (
                      <div key={week.week} className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <span className="text-sm font-medium text-gray-900 w-20">{week.week}</span>
                          <Progress value={week.score} className="flex-1 h-2" />
                        </div>
                        <div className="text-right min-w-20">
                          <div className="text-sm font-semibold text-gray-900">{week.score}%</div>
                          <div className="text-xs text-gray-600">{week.exams} exams</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Study Pattern */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Study Pattern
                  </CardTitle>
                  <CardDescription>Your weekly study distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.studyPattern.map((day) => (
                      <div key={day.day} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 w-12">{day.day}</span>
                        <div className="flex-1 mx-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                              style={{ width: `${(day.hours / 6) * 100}%` }}
                            />
                            <span className="text-xs text-gray-600 w-12">{day.hours}h</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-gray-100">
                          {day.exams} exams
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Exams */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Recent Exam Performance</CardTitle>
                <CardDescription>Your last 5 exam attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.examHistory.map((exam) => (
                    <div key={exam.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-gray-900">{exam.name}</h4>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Rank #{exam.rank}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{exam.date}</span>
                          <span>•</span>
                          <span>{exam.timeSpent}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{exam.score}%</div>
                        <Progress value={exam.score} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analyticsData.subjectPerformance.map((subject) => (
                <Card key={subject.subject} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{subject.subject}</h3>
                      <Badge 
                        variant="outline" 
                        className={
                          subject.trend === "up" 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {subject.trend === "up" ? "+" : ""}{subject.improvement}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Score</span>
                          <span className="font-semibold text-gray-900">{subject.score}%</span>
                        </div>
                        <Progress value={subject.score} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Accuracy</span>
                          <span className="font-semibold text-gray-900">{subject.accuracy}%</span>
                        </div>
                        <Progress value={subject.accuracy} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Time Spent: {subject.timeSpent}</span>
                        <span>Trend: {subject.trend === "up" ? "📈" : "📉"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Accuracy Trend */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Accuracy Trend</CardTitle>
                  <CardDescription>How your accuracy has improved over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.weeklyProgress.map((week, index) => (
                      <div key={week.week} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 w-20">{week.week}</span>
                        <div className="flex-1 mx-4">
                          <Progress value={week.accuracy} className="h-3" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12">{week.accuracy}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Study Consistency */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Study Consistency</CardTitle>
                  <CardDescription>Your daily study hours pattern</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.studyPattern.map((day) => (
                      <div key={day.day} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 w-12">{day.day}</span>
                        <div className="flex-1 mx-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: `${(day.hours / 6) * 100}%` }}
                            />
                            <span className="text-xs text-gray-600">{day.hours}h</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 w-16 text-right">
                          {day.exams} exam{day.exams !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Weak Areas Tab */}
          <TabsContent value="weakness" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-600" />
                  Focus Areas for Improvement
                </CardTitle>
                <CardDescription>Topics that need more attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {analyticsData.weakAreas.map((area) => (
                    <div key={area.topic} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{area.topic}</h4>
                          <Badge 
                            variant="outline" 
                            className={
                              area.improvement >= 0 
                                ? "bg-green-50 text-green-700 border-green-200" 
                                : "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {area.improvement >= 0 ? "+" : ""}{area.improvement}%
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{area.questions} questions practiced</span>
                          <span>•</span>
                          <span>Current accuracy: {area.accuracy}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{area.accuracy}%</div>
                        <Progress value={area.accuracy} className="w-20 h-2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>Based on your performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <BookOpen className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Focus on International Affairs</h4>
                      <p className="text-blue-800 text-sm">
                        Your accuracy in International Affairs is 45%. Try practicing more questions from this topic and review current affairs regularly.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <Zap className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">Improve Time Management</h4>
                      <p className="text-green-800 text-sm">
                        You're spending 45 seconds per question on average. Try speed tests to improve your question-solving speed.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-1">Consistent Study Pattern</h4>
                      <p className="text-purple-800 text-sm">
                        Your study hours vary significantly. Try maintaining a consistent daily study routine for better results.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}