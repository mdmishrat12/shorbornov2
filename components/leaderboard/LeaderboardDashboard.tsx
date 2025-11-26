"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Trophy, 
  Crown, 
  Medal, 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  Target,
  Award,
  Star,
  Clock,
  Zap,
  Calendar
} from "lucide-react"

// Mock leaderboard data
const leaderboardData = {
  overall: [
    { rank: 1, name: "Ahmed Rahman", score: 192, accuracy: 96, timeSpent: "1:32:15", exams: 24, streak: 42, avatar: "👑", isCurrentUser: false },
    { rank: 2, name: "Fatima Begum", score: 188, accuracy: 94, timeSpent: "1:35:42", exams: 22, streak: 38, avatar: "⭐", isCurrentUser: false },
    { rank: 3, name: "Shahriar Khan", score: 185, accuracy: 92.5, timeSpent: "1:38:21", exams: 20, streak: 35, avatar: "🔥", isCurrentUser: false },
    { rank: 4, name: "Nusrat Jahan", score: 178, accuracy: 89, timeSpent: "1:40:33", exams: 18, streak: 28, avatar: "🚀", isCurrentUser: false },
    { rank: 5, name: "Rahim Islam", score: 175, accuracy: 87.5, timeSpent: "1:42:18", exams: 19, streak: 31, avatar: "💫", isCurrentUser: false },
    { rank: 45, name: "Tahmina Akter", score: 162, accuracy: 81, timeSpent: "1:48:32", exams: 16, streak: 24, avatar: "🌟", isCurrentUser: false },
    { rank: 89, name: "Kamal Hossain", score: 155, accuracy: 77.5, timeSpent: "1:46:45", exams: 15, streak: 21, avatar: "🎯", isCurrentUser: false },
    { rank: 156, name: "You", score: 145, accuracy: 72.5, timeSpent: "1:45:23", exams: 12, streak: 18, avatar: "😊", isCurrentUser: true },
    { rank: 234, name: "Jamil Ahmed", score: 138, accuracy: 69, timeSpent: "1:50:12", exams: 11, streak: 15, avatar: "👍", isCurrentUser: false },
    { rank: 312, name: "Sabrina Chowdhury", score: 132, accuracy: 66, timeSpent: "1:52:45", exams: 10, streak: 12, avatar: "👏", isCurrentUser: false }
  ],
  weekly: [
    { rank: 1, name: "Ahmed Rahman", score: 95, accuracy: 95, timeSpent: "4:32:15", exams: 5, improvement: 12, avatar: "👑", isCurrentUser: false },
    { rank: 2, name: "Fatima Begum", score: 92, accuracy: 92, timeSpent: "4:45:42", exams: 4, improvement: 8, avatar: "⭐", isCurrentUser: false },
    { rank: 3, name: "You", score: 88, accuracy: 88, timeSpent: "4:38:21", exams: 4, improvement: 15, avatar: "😊", isCurrentUser: true },
    { rank: 4, name: "Shahriar Khan", score: 85, accuracy: 85, timeSpent: "4:50:33", exams: 3, improvement: 5, avatar: "🔥", isCurrentUser: false },
    { rank: 5, name: "Nusrat Jahan", score: 82, accuracy: 82, timeSpent: "4:42:18", exams: 3, improvement: 3, avatar: "🚀", isCurrentUser: false }
  ],
  subjects: {
    "Bangla": [
      { rank: 1, name: "Ahmed Rahman", score: 98, accuracy: 98, avatar: "👑", isCurrentUser: false },
      { rank: 2, name: "Fatima Begum", score: 95, accuracy: 95, avatar: "⭐", isCurrentUser: false },
      { rank: 15, name: "You", score: 85, accuracy: 85, avatar: "😊", isCurrentUser: true }
    ],
    "English": [
      { rank: 1, name: "Shahriar Khan", score: 96, accuracy: 96, avatar: "🔥", isCurrentUser: false },
      { rank: 2, name: "Ahmed Rahman", score: 94, accuracy: 94, avatar: "👑", isCurrentUser: false },
      { rank: 28, name: "You", score: 78, accuracy: 78, avatar: "😊", isCurrentUser: true }
    ],
    "Mathematics": [
      { rank: 1, name: "Nusrat Jahan", score: 99, accuracy: 99, avatar: "🚀", isCurrentUser: false },
      { rank: 2, name: "You", score: 96, accuracy: 96, avatar: "😊", isCurrentUser: true },
      { rank: 3, name: "Ahmed Rahman", score: 94, accuracy: 94, avatar: "👑", isCurrentUser: false }
    ]
  },
  stats: {
    totalParticipants: 2500,
    averageScore: 128,
    yourRank: 156,
    topPercent: 6.24,
    weeklyImprovement: 8,
    streak: 18
  }
}

const subjects = ["Bangla", "English", "Mathematics", "General Knowledge", "Science", "Computer & IT"]

export function LeaderboardDashboard() {
  const [activeTab, setActiveTab] = useState("overall")
  const [selectedSubject, setSelectedSubject] = useState("Bangla")
  const [searchQuery, setSearchQuery] = useState("")
  const [timeFilter, setTimeFilter] = useState<"all" | "weekly" | "monthly">("all")

  const currentLeaderboard = useMemo(() => {
    if (activeTab === "subjects") {
      return leaderboardData.subjects[selectedSubject as keyof typeof leaderboardData.subjects] || []
    }
    return activeTab === "overall" ? leaderboardData.overall : leaderboardData.weekly
  }, [activeTab, selectedSubject])

  const filteredLeaderboard = useMemo(() => {
    if (!searchQuery) return currentLeaderboard
    
    return currentLeaderboard.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [currentLeaderboard, searchQuery])

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
    if (rank === 2) return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
    if (rank === 3) return "bg-gradient-to-r from-orange-400 to-orange-500 text-white"
    if (rank <= 10) return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
    return "bg-white text-gray-700"
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5" />
    if (rank === 2) return <Medal className="h-5 w-5" />
    if (rank === 3) return <Medal className="h-5 w-5" />
    return <TrendingUp className="h-4 w-4" />
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "👑 Champion"
    if (rank === 2) return "🥈 Silver"
    if (rank === 3) return "🥉 Bronze"
    if (rank <= 10) return "⭐ Top 10"
    if (rank <= 50) return "🔥 Top 50"
    if (rank <= 100) return "🚀 Top 100"
    return "📚 Learner"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compete with fellow BCS aspirants and track your ranking progress
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">#{leaderboardData.stats.yourRank}</div>
              <div className="text-gray-600">Your Rank</div>
              <Badge className="bg-green-100 text-green-700 mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                Top {leaderboardData.stats.topPercent}%
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{leaderboardData.stats.totalParticipants}</div>
              <div className="text-gray-600">Total Participants</div>
              <Badge variant="outline" className="mt-2">
                <Users className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{leaderboardData.stats.averageScore}</div>
              <div className="text-gray-600">Average Score</div>
              <Badge variant="outline" className="mt-2">
                <Target className="h-3 w-3 mr-1" />
                Benchmark
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{leaderboardData.stats.streak}</div>
              <div className="text-gray-600">Day Streak</div>
              <Badge className="bg-orange-100 text-orange-700 mt-2">
                <Zap className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {/* Tabs Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <TabsList className="grid w-full lg:w-auto grid-cols-3">
                  <TabsTrigger value="overall" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Overall
                  </TabsTrigger>
                  <TabsTrigger value="weekly" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger value="subjects" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    By Subject
                  </TabsTrigger>
                </TabsList>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Subject Selector */}
                  {activeTab === "subjects" && (
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  )}

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search participants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full lg:w-64"
                    />
                  </div>

                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>

              {/* Overall Leaderboard */}
              <TabsContent value="overall" className="space-y-4">
                <div className="space-y-3">
                  {filteredLeaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                        ${user.isCurrentUser 
                          ? 'border-blue-500 bg-blue-50 shadow-lg' 
                          : 'border-gray-100 bg-white hover:border-gray-200'
                        }
                      `}
                    >
                      {/* Rank */}
                      <div className={`
                        flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg
                        ${getRankColor(user.rank)}
                      `}>
                        {user.rank <= 3 ? getRankIcon(user.rank) : user.rank}
                      </div>

                      {/* User Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="text-2xl">{user.avatar}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold truncate ${
                              user.isCurrentUser ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {user.name}
                            </h3>
                            {user.rank <= 10 && (
                              <Badge variant="secondary" className="text-xs">
                                {getRankBadge(user.rank)}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {user.accuracy}% accuracy
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {user.timeSpent}
                            </span>
                            <span>•</span>
                            <span>{user.exams} exams</span>
                          </div>
                        </div>
                      </div>

                      {/* Score & Streak */}
                      <div className="text-right min-w-24">
                        <div className="text-2xl font-bold text-gray-900">
                          {user.score}
                        </div>
                        <div className="flex items-center gap-1 justify-end text-sm text-gray-600">
                          <Zap className="h-3 w-3 text-orange-500" />
                          {user.streak} day streak
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center pt-4">
                  <Button variant="outline">
                    Load More Participants
                  </Button>
                </div>
              </TabsContent>

              {/* Weekly Leaderboard */}
              <TabsContent value="weekly" className="space-y-4">
                <div className="space-y-3">
                  {filteredLeaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                        ${user.isCurrentUser 
                          ? 'border-green-500 bg-green-50 shadow-lg' 
                          : 'border-gray-100 bg-white hover:border-gray-200'
                        }
                      `}
                    >
                      {/* Rank */}
                      <div className={`
                        flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg
                        ${getRankColor(user.rank)}
                      `}>
                        {user.rank <= 3 ? getRankIcon(user.rank) : user.rank}
                      </div>

                      {/* User Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="text-2xl">{user.avatar}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold truncate ${
                              user.isCurrentUser ? 'text-green-900' : 'text-gray-900'
                            }`}>
                              {user.name}
                            </h3>
                            <Badge 
                              variant="outline"
                              className={
                                user.improvement >= 0 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : 'bg-red-50 text-red-700 border-red-200'
                              }
                            >
                              {user.improvement >= 0 ? '+' : ''}{user.improvement}%
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{user.accuracy}% accuracy</span>
                            <span>•</span>
                            <span>{user.timeSpent} total</span>
                            <span>•</span>
                            <span>{user.exams} exams</span>
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {user.score}
                        </div>
                        <div className="text-sm text-gray-600">
                          Weekly Score
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Subject Leaderboard */}
              <TabsContent value="subjects" className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedSubject} Leaderboard</h3>
                  <p className="text-gray-600">Top performers in {selectedSubject}</p>
                </div>

                <div className="space-y-3">
                  {filteredLeaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                        ${user.isCurrentUser 
                          ? 'border-purple-500 bg-purple-50 shadow-lg' 
                          : 'border-gray-100 bg-white hover:border-gray-200'
                        }
                      `}
                    >
                      {/* Rank */}
                      <div className={`
                        flex items-center justify-center w-12 h-12 rounded-xl font-bold text-lg
                        ${getRankColor(user.rank)}
                      `}>
                        {user.rank <= 3 ? getRankIcon(user.rank) : user.rank}
                      </div>

                      {/* User Info */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="text-2xl">{user.avatar}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold truncate ${
                              user.isCurrentUser ? 'text-purple-900' : 'text-gray-900'
                            }`}>
                              {user.name}
                            </h3>
                            {user.rank <= 3 && (
                              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                {user.rank === 1 ? 'Gold' : user.rank === 2 ? 'Silver' : 'Bronze'}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Subject Mastery: {user.accuracy}% accuracy
                          </div>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {user.score}%
                        </div>
                        <div className="text-sm text-gray-600">
                          Score
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Achievement Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Your Achievements
            </CardTitle>
            <CardDescription>Milestones and badges you've earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">Top 10%</div>
                <div className="text-sm text-gray-600">Elite Rank</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <Zap className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">18 Days</div>
                <div className="text-sm text-gray-600">Study Streak</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">12 Exams</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="font-semibold text-gray-900">+15%</div>
                <div className="text-sm text-gray-600">Improvement</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}