"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bookmark, 
  Clock, 
  Eye, 
  Flag, 
  CheckCircle2, 
  XCircle,
  Star,
  Target
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Question {
  id: string
  questionText: string
  questionTextBn?: string
  subject: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  bcsYear?: number
  bcsCadre?: string
  marks: number
  timeRequired: number
  attempts: number
  correctAttempts: number
  isBookmarked: boolean
  isMarked: boolean
  userAnswer?: string
  isCorrect?: boolean
  options: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
}

interface QuestionCardProps {
  question: Question
  viewMode: 'grid' | 'list'
}

export function QuestionCard({ question, viewMode }: QuestionCardProps) {
  const [showExplanation, setShowExplanation] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(question.isBookmarked)
  const [isMarked, setIsMarked] = useState(question.isMarked)

  const accuracy = question.attempts > 0 
    ? Math.round((question.correctAttempts / question.attempts) * 100)
    : 0

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700'
  }

  const statusColors = {
    correct: 'bg-green-50 border-green-200',
    incorrect: 'bg-red-50 border-red-200',
    unattempted: 'bg-white border-gray-200'
  }

  const getStatus = () => {
    if (question.userAnswer === undefined) return 'unattempted'
    return question.isCorrect ? 'correct' : 'incorrect'
  }

  const status = getStatus()

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md border-2",
      statusColors[status]
    )}>
      <CardContent className="p-6">
        {/* Question Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {question.subject}
              </Badge>
              <Badge variant="outline" className="text-gray-600">
                {question.topic}
              </Badge>
              <Badge className={difficultyColors[question.difficulty]}>
                {question.difficulty}
              </Badge>
              {question.bcsYear && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700">
                  BCS {question.bcsYear}
                </Badge>
              )}
            </div>

            {/* Question Text */}
            <h3 className="text-lg font-medium text-gray-900 mb-2 leading-relaxed">
              {question.questionText}
            </h3>
            {question.questionTextBn && (
              <p className="text-gray-600 text-sm mb-4 leading-relaxed font-bangla">
                {question.questionTextBn}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={cn(
                "h-8 w-8",
                isBookmarked && "text-yellow-500 hover:text-yellow-600"
              )}
            >
              <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMarked(!isMarked)}
              className={cn(
                "h-8 w-8",
                isMarked && "text-red-500 hover:text-red-600"
              )}
            >
              <Flag className={cn("h-4 w-4", isMarked && "fill-current")} />
            </Button>
          </div>
        </div>

        {/* Options */}
        <div className="grid gap-2 mb-4">
          {question.options.map((option, index) => (
            <div
              key={option.id}
              className={cn(
                "p-3 rounded-lg border text-sm transition-all",
                option.isCorrect && showExplanation
                  ? "bg-green-50 border-green-200 text-green-800"
                  : question.userAnswer === option.id && !option.isCorrect
                  ? "bg-red-50 border-red-200 text-red-800"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium w-6">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span>{option.text}</span>
                {showExplanation && option.isCorrect && (
                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                )}
                {showExplanation && question.userAnswer === option.id && !option.isCorrect && (
                  <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{question.timeRequired}s</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{accuracy}% accuracy</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{question.marks} mark{question.marks > 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExplanation(!showExplanation)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showExplanation ? 'Hide' : 'Show'} Explanation
            </Button>
            <Button size="sm">
              Start Practice
            </Button>
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
            <p className="text-blue-800 text-sm">
              This question tests fundamental concepts of {question.topic}. The correct answer is 
              option {question.options.findIndex(opt => opt.isCorrect) + 1} because...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}