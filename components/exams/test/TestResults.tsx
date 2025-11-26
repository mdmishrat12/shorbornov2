"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle2, 
  XCircle,
  RotateCcw,
  Home,
  Share,
  Crown,
  Medal,
  TrendingUp,
  Users
} from "lucide-react"

const results = {
  totalQuestions: 200,
  correctAnswers: 145,
  wrongAnswers: 35,
  skippedQuestions: 20,
  timeSpent: "1:45:23",
  score: 145,
  totalMarks: 200,
  percentage: 72.5,
  rank: 156,
  totalParticipants: 2500,
  subjectWise: [
    { subject: "Bangla", correct: 28, total: 35, percentage: 80 },
    { subject: "English", correct: 25, total: 35, percentage: 71.4 },
    { subject: "Bangladesh Affairs", correct: 22, total: 30, percentage: 73.3 },
    { subject: "International Affairs", correct: 14, total: 20, percentage: 70 },
    { subject: "General Science", correct: 10, total: 15, percentage: 66.7 },
    { subject: "Computer & IT", correct: 11, total: 15, percentage: 73.3 },
    { subject: "Mental Skills", correct: 35, total: 50, percentage: 70 }
  ]
}

// Mock leaderboard data
const leaderboard = [
  { rank: 1, name: "Ahmed Rahman", score: 192, time: "1:32:15", accuracy: 96, avatar: "👑" },
  { rank: 2, name: "Fatima Begum", score: 188, time: "1:35:42", accuracy: 94, avatar: "⭐" },
  { rank: 3, name: "Shahriar Khan", score: 185, time: "1:38:21", accuracy: 92.5, avatar: "🔥" },
  { rank: 4, name: "Nusrat Jahan", score: 178, time: "1:40:33", accuracy: 89, avatar: "🚀" },
  { rank: 5, name: "Rahim Islam", score: 175, time: "1:42:18", accuracy: 87.5, avatar: "💫" },
  { rank: 45, name: "Tahmina Akter", score: 162, time: "1:48:32", accuracy: 81, avatar: "🌟" },
  { rank: 89, name: "Kamal Hossain", score: 155, time: "1:46:45", accuracy: 77.5, avatar: "🎯" },
  { rank: 156, name: "You", score: 145, time: "1:45:23", accuracy: 72.5, avatar: "😊", isCurrentUser: true },
  { rank: 234, name: "Jamil Ahmed", score: 138, time: "1:50:12", accuracy: 69, avatar: "👍" },
  { rank: 312, name: "Sabrina Chowdhury", score: 132, time: "1:52:45", accuracy: 66, avatar: "👏" }
]

export function TestResults({ examId }: { examId: string }) {
  const router = useRouter()

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    if (rank === 2) return "bg-gray-100 text-gray-800 border-gray-200"
    if (rank === 3) return "bg-orange-100 text-orange-800 border-orange-200"
    if (rank <= 10) return "bg-blue-50 text-blue-700 border-blue-200"
    return "bg-white text-gray-700 border-gray-200"
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4 fill-yellow-500 text-yellow-500" />
    if (rank === 2) return <Medal className="h-4 w-4 fill-gray-400 text-gray-400" />
    if (rank === 3) return <Medal className="h-4 w-4 fill-orange-400 text-orange-400" />
    if (rank <= 10) return <TrendingUp className="h-4 w-4 text-blue-500" />
    return <Users className="h-4 w-4 text-gray-400" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Test Completed!
          </h1>
          <p className="text-lg text-gray-600">
            Here's your performance summary
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Score Card */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {results.percentage}%
                </div>
                <div className="text-lg text-gray-600">Overall Score</div>
                <Progress value={results.percentage} className="h-2 mt-4" />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-green-50 rounded-lg">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{results.correctAnswers}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{results.wrongAnswers}</div>
                  <div className="text-sm text-gray-600">Wrong</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{results.skippedQuestions}</div>
                  <div className="text-sm text-gray-600">Skipped</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rank Card */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  #{results.rank}
                </div>
                <div className="text-gray-600 mb-4">Your Rank</div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Top {Math.round((results.rank / results.totalParticipants) * 100)}%
                </Badge>
                <div className="text-sm text-gray-500 mt-2">
                  Out of {results.totalParticipants} participants
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Subject-wise Performance */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Subject-wise Performance
              </h3>
              <div className="space-y-4">
                {results.subjectWise.map((subject, index) => (
                  <div key={subject.subject} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{subject.subject}</span>
                        <span className="text-sm text-gray-600">
                          {subject.correct}/{subject.total} ({subject.percentage}%)
                        </span>
                      </div>
                      <Progress value={subject.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Exam Leaderboard
                </h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {results.totalParticipants} Participants
                </Badge>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {leaderboard.map((participant) => (
                  <div
                    key={participant.rank}
                    className={`
                      flex items-center gap-4 p-3 rounded-lg border-2 transition-all
                      ${participant.isCurrentUser 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : 'border-gray-100'
                      }
                      ${getRankColor(participant.rank)}
                    `}
                  >
                    {/* Rank */}
                    <div className="flex items-center gap-2 min-w-12">
                      <div className="flex items-center gap-1">
                        {getRankIcon(participant.rank)}
                        <span className="font-bold text-sm">{participant.rank}</span>
                      </div>
                    </div>

                    {/* Avatar & Name */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-xl">{participant.avatar}</div>
                      <div className="min-w-0 flex-1">
                        <div className={`font-medium truncate ${
                          participant.isCurrentUser ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {participant.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {participant.time}
                        </div>
                      </div>
                    </div>

                    {/* Score & Accuracy */}
                    <div className="text-right min-w-20">
                      <div className="font-bold text-gray-900">
                        {participant.score}
                      </div>
                      <div className="text-xs text-gray-500">
                        {participant.accuracy}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Leaderboard Stats */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-semibold text-gray-900">Top 1%</div>
                    <div className="text-gray-600">Score: 185+</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Top 10%</div>
                    <div className="text-gray-600">Score: 160+</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Average</div>
                    <div className="text-gray-600">Score: 128</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Performance Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900">+8 Positions</div>
                <div className="text-sm text-gray-600">Rank Improvement</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-lg">
                <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900">Top 7%</div>
                <div className="text-sm text-gray-600">Among Participants</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-100 rounded-lg">
                <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900">14:37</div>
                <div className="text-sm text-gray-600">Time Remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => router.push(`/student/exams/${examId}/review`)}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Review Answers
          </Button>
          <Button 
            onClick={() => router.push('/student/exams')}
            variant="outline"
            className="px-8 py-3"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Exams
          </Button>
          <Button 
            onClick={() => router.push('/student/leaderboard')}
            variant="outline" 
            className="px-8 py-3"
          >
            <Trophy className="h-5 w-5 mr-2" />
            Full Leaderboard
          </Button>
          <Button variant="outline" className="px-8 py-3">
            <Share className="h-5 w-5 mr-2" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  )
}