"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  Target, 
  Clock, 
  CheckCircle, 
  PlayCircle,
  BarChart3,
  Award,
  Loader2,
  AlertCircle
} from "lucide-react"
import { useCourses, useCourse, useUserStats, useQuickProgress } from "@/hooks/useUserProfile"
import { toast } from "sonner"

interface LearningSubject {
  id: string
  name: string
  description: string
  progress: number
  completedLessons: number
  totalLessons: number
  lessons: LearningLesson[]
}

interface LearningLesson {
  id: string
  title: string
  content: string
  estimatedMarks: number
  importance: 'low' | 'medium' | 'high'
  order: number
  isPublished: boolean
  createdAt: string
  completed: boolean
  score?: number
  timeSpent: number
  lastAccessed?: string
}

export function LearningDashboard() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  
  // Use hooks for data fetching
  const { courses, isLoading: coursesLoading, error: coursesError } = useCourses()
  const { stats, isLoading: statsLoading, error: statsError } = useUserStats()
  const { 
    course: selectedCourseData, 
    subjects, 
    isLoading: courseLoading, 
    error: courseError,
    markLessonCompleted,
    updateStudyTime
  } = useCourse(selectedCourse || '')
  const { completeLesson, isUpdatingProgress } = useQuickProgress()
console.log('course Data:',courses)
console.log('stats Data:',stats)
console.log('stats subjects:',subjects)
  // Set first course as selected when courses load
  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0].id)
    }
  }, [courses, selectedCourse])

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const startLesson = async (lessonId: string) => {
    try {
      // Update study time when starting a lesson
      await updateStudyTime(lessonId, 5) // Add 5 minutes when starting
      
      // Navigate to lesson page or open lesson modal
      console.log("Starting lesson:", lessonId)
      toast.info('Opening lesson...')
      
      // In a real app, you would navigate to the lesson page:
      // router.push(`/lessons/${lessonId}`)
    } catch (error) {
      toast.error('Failed to start lesson')
    }
  }

  const takeExam = (lessonId: string) => {
    // Navigate to exam page
    console.log("Taking exam for lesson:", lessonId)
    toast.info('Opening exam...')
    
    // In a real app, you would navigate to the exam page:
    // router.push(`/exams?lessonId=${lessonId}`)
  }

  const completeLessonWithScore = async (lessonId: string, score: number, timeSpent: number) => {
    try {
      await completeLesson(lessonId, score, timeSpent)
    } catch (error) {
      console.error('Failed to complete lesson:', error)
    }
  }

  const formatStudyTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  // Loading state
  if (coursesLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Loading your learning dashboard...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (coursesError || statsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load data</h3>
          <p className="text-gray-600 mb-4">Please try refreshing the page</p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    )
  }

  // No courses state
  if (courses.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Courses Yet</h2>
            <p className="text-gray-600 mb-6">Start your learning journey by enrolling in a course</p>
            <Button onClick={() => window.location.href = '/courses'}>
              Browse Courses
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Dashboard</h1>
          <p className="text-gray-600 mt-2">Continue your preparation journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Course List */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {courses.map(course => (
                  <div
                    key={course.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedCourse === course.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCourse(course.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{course.title}</h3>
                      <Badge className="text-xs">{course.category}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">{course.progress || 0}%</span>
                      </div>
                      <Progress value={course.progress || 0} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Study Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Lessons Completed</span>
                  </div>
                  <span className="font-semibold">
                    {stats?.completedLessons || 0}/{stats?.totalLessons || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Total Study Time</span>
                  </div>
                  <span className="font-semibold">
                    {formatStudyTime(stats?.totalStudyTime || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-gray-600">Average Score</span>
                  </div>
                  <span className="font-semibold">{stats?.averageScore || 0}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Course Details */}
          <div className="lg:col-span-3 space-y-6">
            {courseLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                    <span>Loading course details...</span>
                  </div>
                </CardContent>
              </Card>
            ) : courseError ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-red-600">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>Failed to load course details</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedCourseData?.title || 'Loading...'}</span>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-gray-400" />
                        <span className="text-lg font-bold text-gray-900">
                          {selectedCourseData?.progress || 0}% Complete
                        </span>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {selectedCourseData?.description || 'Continue from where you left off'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {subjects.map(subject => (
                        <div key={subject.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                              {subject.description && (
                                <p className="text-gray-600 text-sm mt-1">{subject.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                Progress: {subject.progress || 0}%
                              </span>
                              <Progress value={subject.progress || 0} className="w-24 h-2" />
                            </div>
                          </div>

                          <div className="space-y-3">
                            {subject.lessons && subject.lessons.map(lesson => (
                              <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3 flex-1">
                                  {lesson.completed ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <PlayCircle className="h-5 w-5 text-blue-600" />
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{lesson.title}</span>
                                      <Badge className={getImportanceColor(lesson.importance)}>
                                        {lesson.importance}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                      <div className="flex items-center gap-1">
                                        <Target className="h-3 w-3" />
                                        {lesson.estimatedMarks} marks
                                      </div>
                                      {lesson.timeSpent > 0 && (
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {formatStudyTime(lesson.timeSpent)}
                                        </div>
                                      )}
                                      {lesson.score && (
                                        <div className="flex items-center gap-1">
                                          <Award className="h-3 w-3" />
                                          Score: {lesson.score}%
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant={lesson.completed ? "outline" : "default"}
                                    onClick={() => startLesson(lesson.id)}
                                    disabled={isUpdatingProgress}
                                  >
                                    {isUpdatingProgress ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : lesson.completed ? (
                                      "Review"
                                    ) : (
                                      "Start"
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => takeExam(lesson.id)}
                                  >
                                    Take Exam
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended Next Steps */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Next Steps</CardTitle>
                    <CardDescription>
                      Based on your progress and performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* High importance lessons recommendation */}
                      <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-yellow-800">Complete High-Importance Lessons</h4>
                          <p className="text-yellow-700 text-sm">
                            Focus on lessons marked as high importance for maximum marks
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            // Find first incomplete high importance lesson
                            const highImportanceLesson = subjects
                              .flatMap(subject => subject.lessons || [])
                              .find(lesson => lesson.importance === 'high' && !lesson.completed)
                            
                            if (highImportanceLesson) {
                              startLesson(highImportanceLesson.id)
                            } else {
                              toast.info('All high importance lessons completed!')
                            }
                          }}
                        >
                          Start Next
                        </Button>
                      </div>
                      
                      {/* Practice recommendation */}
                      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-blue-800">Practice Weak Areas</h4>
                          <p className="text-blue-700 text-sm">
                            Take exams on completed lessons to improve your scores
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            // Find first completed lesson that could use improvement
                            const practiceLesson = subjects
                              .flatMap(subject => subject.lessons || [])
                              .find(lesson => lesson.completed && (!lesson.score || lesson.score < 80))
                            
                            if (practiceLesson) {
                              takeExam(practiceLesson.id)
                            } else {
                              toast.info('All lessons have good scores!')
                            }
                          }}
                        >
                          Practice Now
                        </Button>
                      </div>

                      {/* Continue progress recommendation */}
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-green-800">Continue Your Progress</h4>
                          <p className="text-green-700 text-sm">
                            Pick up where you left off and maintain your learning streak
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            // Find first incomplete lesson
                            const nextLesson = subjects
                              .flatMap(subject => subject.lessons || [])
                              .find(lesson => !lesson.completed)
                            
                            if (nextLesson) {
                              startLesson(nextLesson.id)
                            } else {
                              toast.success('All lessons completed! 🎉')
                            }
                          }}
                        >
                          Continue Learning
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}