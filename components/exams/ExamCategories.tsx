"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Zap, 
  Crown,
  Calendar,
  Users
} from "lucide-react"

const examCategories = [
  {
    title: "Full Model Tests",
    description: "Complete BCS preliminary exam simulations",
    icon: Target,
    color: "from-red-500 to-pink-500",
    count: 12,
    duration: "120 mins",
    questions: 200,
    popular: true
  },
  {
    title: "Subject-wise Tests",
    description: "Focus on specific subjects and topics",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    count: 45,
    duration: "30-60 mins",
    questions: "50-100",
    popular: false
  },
  {
    title: "Speed Tests",
    description: "Quick tests to improve speed and accuracy",
    icon: Zap,
    color: "from-orange-500 to-yellow-500",
    count: 18,
    duration: "15-30 mins",
    questions: "25-50",
    popular: true
  },
  {
    title: "Previous Years",
    description: "Actual BCS questions from past exams",
    icon: Calendar,
    color: "from-green-500 to-emerald-500",
    count: 24,
    duration: "Varies",
    questions: "Varies",
    popular: false
  },
  {
    title: "Weak Area Tests",
    description: "Personalized tests based on your performance",
    icon: TrendingUp,
    color: "from-purple-500 to-indigo-500",
    count: 8,
    duration: "45 mins",
    questions: 75,
    popular: true
  },
  {
    title: "Competitive Tests",
    description: "Live tests with real-time ranking",
    icon: Users,
    color: "from-amber-500 to-orange-500",
    count: 6,
    duration: "90-120 mins",
    questions: "150-200",
    popular: false
  }
]

export function ExamCategories() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Exam Categories</h2>
          <p className="text-gray-600">Choose your preferred exam type</p>
        </div>
        <Button variant="outline">
          View All Categories
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examCategories.map((category, index) => {
          const Icon = category.icon
          return (
            <Card 
              key={category.title}
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              
              {/* Popular Badge */}
              {category.popular && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                  <Crown className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}

              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-white shadow-lg`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-bold text-gray-900">
                      {category.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{category.count}</div>
                    <div className="text-xs text-gray-600">Tests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">{category.duration}</div>
                    <div className="text-xs text-gray-600">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">{category.questions}</div>
                    <div className="text-xs text-gray-600">Questions</div>
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  className={`w-full bg-gradient-to-r ${category.color} hover:shadow-lg transition-all`}
                >
                  Explore Tests
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}