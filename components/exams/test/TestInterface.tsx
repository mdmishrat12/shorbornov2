"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  Circle,
  Send,
  Bookmark,
  Search,
  ChevronFirst,
  ChevronLast,
  Grid,
  List
} from "lucide-react"

// Generate 200 questions
const questions = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  question: `BCS Preliminary Exam Question ${i + 1}: What is the correct answer for this sample question about various subjects?`,
  options: [
    `Option A: Correct answer for question ${i + 1}`,
    `Option B: Incorrect option one for question ${i + 1}`,
    `Option C: Incorrect option two for question ${i + 1}`,
    `Option D: Incorrect option three for question ${i + 1}`
  ],
  correctAnswer: 0,
  subject: ["Bangla", "English", "Math", "General Knowledge", "Science"][i % 5],
  marked: false,
  visited: false,
  answered: false,
  userAnswer: null as number | null
}))

const QUESTIONS_PER_PAGE = 20
const TOTAL_PAGES = Math.ceil(questions.length / QUESTIONS_PER_PAGE)

export function TestInterface({ examId }: { examId: string }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [timeLeft, setTimeLeft] = useState(120 * 60)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "answered" | "unanswered" | "marked">("all")

  const question = questions[currentQuestion]
  const totalQuestions = questions.length
  const answeredQuestions = Object.keys(answers).length
  const progress = (answeredQuestions / totalQuestions) * 100

  // Get questions for current page
  const currentPageQuestions = useMemo(() => {
    const startIndex = currentPage * QUESTIONS_PER_PAGE
    const endIndex = startIndex + QUESTIONS_PER_PAGE
    return questions.slice(startIndex, endIndex)
  }, [currentPage])

  // Update current page when question changes
  useEffect(() => {
    const newPage = Math.floor(currentQuestion / QUESTIONS_PER_PAGE)
    if (newPage !== currentPage) {
      setCurrentPage(newPage)
    }
  }, [currentQuestion, currentPage])

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }))
  }

  const handleMarkQuestion = () => {
    const newSet = new Set(markedQuestions)
    if (newSet.has(currentQuestion)) {
      newSet.delete(currentQuestion)
    } else {
      newSet.add(currentQuestion)
    }
    setMarkedQuestions(newSet)
  }

  const handleQuickNavigation = (direction: "next" | "prev") => {
    if (direction === "next" && currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else if (direction === "prev" && currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleQuestionNavigation = (questionIndex: number) => {
    setCurrentQuestion(questionIndex)
  }

  const handlePageNavigation = (page: number) => {
    if (page >= 0 && page < TOTAL_PAGES) {
      setCurrentPage(page)
      // Set to first question of the new page
      setCurrentQuestion(page * QUESTIONS_PER_PAGE)
    }
  }

  const handleAutoSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      router.push(`/student/exams/${examId}/results`)
    }, 2000)
  }

  const handleSubmitTest = () => {
    if (window.confirm('Are you sure you want to submit the test? You cannot change answers after submission.')) {
      handleAutoSubmit()
    }
  }

  const getQuestionStatus = (index: number) => {
    if (answers[index] !== undefined) return 'answered'
    if (markedQuestions.has(index)) return 'marked'
    return 'not-visited'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return 'bg-green-500 border-green-600 text-white'
      case 'marked': return 'bg-yellow-500 border-yellow-600 text-white'
      default: return 'bg-gray-200 border-gray-300 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered': return '✓'
      case 'marked': return '📍'
      default: return '○'
    }
  }

  // Get page summary
  const getPageSummary = (page: number) => {
    const start = page * QUESTIONS_PER_PAGE
    const end = Math.min(start + QUESTIONS_PER_PAGE, totalQuestions)
    const pageQuestions = questions.slice(start, end)
    const answered = pageQuestions.filter((_, idx) => answers[start + idx] !== undefined).length
    const marked = pageQuestions.filter((_, idx) => markedQuestions.has(start + idx)).length
    
    return {
      start: start + 1,
      end,
      answered,
      marked,
      total: end - start
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              {/* Timer */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 font-mono">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-xs text-gray-500">Time Remaining</div>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    Q{currentQuestion + 1} of {totalQuestions}
                  </div>
                  <div className="text-xs text-gray-500">
                    {answeredQuestions} answered • {markedQuestions.size} marked
                  </div>
                </div>
                <Progress value={progress} className="w-32 h-2" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Section */}
          <div className="lg:col-span-3">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {question.subject}
                    </Badge>
                    <span className="text-sm text-gray-500">Question {currentQuestion + 1}</span>
                    <span className="text-sm text-gray-500">
                      Page {currentPage + 1} of {TOTAL_PAGES}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkQuestion}
                    className={markedQuestions.has(currentQuestion) ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                  >
                    <Flag className={`h-4 w-4 mr-2 ${markedQuestions.has(currentQuestion) ? "fill-yellow-500" : ""}`} />
                    {markedQuestions.has(currentQuestion) ? "Marked" : "Mark"}
                  </Button>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
                    {question.question}
                  </h3>
                  
                  {/* Options */}
                  <div className="space-y-3">
                    {question.options.map((option, index) => {
                      const isSelected = answers[currentQuestion] === index
                      return (
                        <div
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          className={`
                            flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all
                            ${isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 bg-white hover:border-gray-300'
                            }
                          `}
                        >
                          <div className={`
                            flex h-6 w-6 items-center justify-center rounded-full border-2 flex-shrink-0 mt-0.5
                            ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}
                          `}>
                            {isSelected ? (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                              {String.fromCharCode(65 + index)}. {option}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Quick Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => handleQuickNavigation("prev")}
                    disabled={currentQuestion === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-mono">
                      {currentQuestion + 1} / {totalQuestions}
                    </span>
                  </div>

                  <Button
                    onClick={() => handleQuickNavigation("next")}
                    disabled={currentQuestion === totalQuestions - 1}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Navigation Panel */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-200 shadow-sm sticky top-24">
              <CardContent className="p-6">
                {/* Navigation Header */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Page Navigation</h4>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {answeredQuestions}/{totalQuestions}
                  </Badge>
                </div>

                {/* Page Navigation */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-gray-700">Pages</h5>
                    <span className="text-xs text-gray-500">
                      {currentPage + 1} of {TOTAL_PAGES}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {Array.from({ length: TOTAL_PAGES }, (_, index) => {
                      const summary = getPageSummary(index)
                      const isCurrentPage = index === currentPage
                      return (
                        <button
                          key={index}
                          onClick={() => handlePageNavigation(index)}
                          className={`
                            p-2 rounded-lg border text-xs text-center transition-all
                            ${isCurrentPage
                              ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                              : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                            }
                          `}
                        >
                          <div className="font-semibold">{index + 1}</div>
                          <div className="text-[10px] text-gray-500">
                            ✓{summary.answered}/{summary.total}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Page Controls */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageNavigation(0)}
                      disabled={currentPage === 0}
                      className="flex-1"
                    >
                      <ChevronFirst className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageNavigation(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="flex-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageNavigation(currentPage + 1)}
                      disabled={currentPage === TOTAL_PAGES - 1}
                      className="flex-1"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageNavigation(TOTAL_PAGES - 1)}
                      disabled={currentPage === TOTAL_PAGES - 1}
                      className="flex-1"
                    >
                      <ChevronLast className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Current Page Questions */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-gray-700">
                      Page {currentPage + 1} Questions
                    </h5>
                    <span className="text-xs text-gray-500">
                      {getPageSummary(currentPage).answered}/{QUESTIONS_PER_PAGE} answered
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {currentPageQuestions.map((q, index) => {
                      const globalIndex = currentPage * QUESTIONS_PER_PAGE + index
                      const status = getQuestionStatus(globalIndex)
                      const isCurrent = globalIndex === currentQuestion
                      
                      return (
                        <button
                          key={globalIndex}
                          onClick={() => handleQuestionNavigation(globalIndex)}
                          className={`
                            aspect-square rounded border text-xs font-medium transition-all
                            ${isCurrent
                              ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-500 text-white'
                              : getStatusColor(status)
                            }
                            hover:scale-105
                          `}
                          title={`Q${globalIndex + 1}: ${status}`}
                        >
                          {globalIndex + 1}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="space-y-2 mb-4">
                  <div className="flex gap-1">
                    {[
                      { key: "all" as const, label: "All", count: totalQuestions },
                      { key: "answered" as const, label: "Answered", count: answeredQuestions },
                      { key: "unanswered" as const, label: "Unanswered", count: totalQuestions - answeredQuestions },
                      { key: "marked" as const, label: "Marked", count: markedQuestions.size }
                    ].map((filterItem) => (
                      <button
                        key={filterItem.key}
                        onClick={() => setFilter(filterItem.key)}
                        className={`
                          flex-1 p-1 rounded text-xs font-medium transition-all
                          ${filter === filterItem.key
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                      >
                        {filterItem.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Jump to Filtered */}
                {filter !== "all" && (
                  <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xs text-blue-800 text-center">
                      Filter: {filter} ({filter === "answered" ? answeredQuestions : 
                        filter === "unanswered" ? totalQuestions - answeredQuestions : 
                        markedQuestions.size})
                    </div>
                  </div>
                )}

                {/* Page Summary */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{answeredQuestions}</div>
                      <div className="text-gray-600">Answered</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{markedQuestions.size}</div>
                      <div className="text-gray-600">Marked</div>
                    </div>
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