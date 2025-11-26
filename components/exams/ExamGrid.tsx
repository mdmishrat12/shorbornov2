"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Users, Star, Target, Crown } from "lucide-react"

const exams = [
  {
    id: 1,
    title: "BCS 44th Preliminary Simulation",
    description: "Complete mock test based on latest pattern with detailed analytics",
    type: "model",
    difficulty: "Advanced",
    duration: 120,
    questions: 200,
    participants: 2547,
    rating: 4.8,
    attempts: 1843,
    isPro: true
  },
  {
    id: 2,
    title: "Bangla Literature Master Test",
    description: "Comprehensive coverage of Bangla literature topics and authors",
    type: "subject",
    difficulty: "Medium",
    duration: 60,
    questions: 100,
    participants: 1876,
    rating: 4.6,
    attempts: 1245,
    isPro: false
  },
  {
    id: 3,
    title: "English Grammar & Composition",
    description: "Focus on grammar rules, vocabulary, and writing skills",
    type: "subject",
    difficulty: "Medium",
    duration: 45,
    questions: 75,
    participants: 2314,
    rating: 4.7,
    attempts: 1890,
    isPro: false
  },
  {
    id: 4,
    title: "General Knowledge Challenge",
    description: "Current affairs, Bangladesh studies, and international events",
    type: "subject",
    difficulty: "Mixed",
    duration: 50,
    questions: 80,
    participants: 1987,
    rating: 4.5,
    attempts: 1567,
    isPro: true
  }
]

export function ExamGrid() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Exams</h2>
          <p className="text-gray-600">Choose from our comprehensive exam library</p>
        </div>
        <Button variant="outline">
          View All Exams
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {exams.map((exam, index) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {exam.title}
                      </h3>
                      {exam.isPro && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                          <Crown className="h-3 w-3 mr-1" />
                          PRO
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {exam.description}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>{exam.duration}m</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="h-4 w-4 text-green-600" />
                    <span>{exam.questions} Qs</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span>{exam.participants.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-600 fill-yellow-400" />
                    <span>{exam.rating}</span>
                  </div>
                </div>

                {/* Difficulty & Type */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    <Badge 
                      variant="outline" 
                      className={`
                        ${exam.difficulty === 'Advanced' ? 'bg-red-50 text-red-700 border-red-200' : 
                          exam.difficulty === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                          'bg-blue-50 text-blue-700 border-blue-200'}
                      `}
                    >
                      {exam.difficulty}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      {exam.type}
                    </Badge>
                  </div>
                </div>

                {/* Action Button */}
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                  <Play className="h-4 w-4 mr-2" />
                  Start Exam
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}