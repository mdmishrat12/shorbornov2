"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Play, 
  Clock, 
  Users, 
  Trophy, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Crown
} from "lucide-react"
import { cn } from "@/lib/utils"

const featuredExams = [
  {
    id: 1,
    title: "BCS 44th Preliminary Simulation",
    description: "Full-length mock test based on the latest BCS pattern with detailed analytics",
    duration: 120,
    questions: 200,
    participants: 2547,
    difficulty: "Advanced",
    rating: 4.8,
    attempts: 1843,
    image: "🎯",
    bgGradient: "from-purple-500 to-pink-500",
    isPro: true,
    tags: ["Latest", "Full Test", "Analytics"]
  },
  {
    id: 2,
    title: "Bangla Literature Master Challenge",
    description: "Comprehensive Bangla literature test covering all major topics and authors",
    duration: 60,
    questions: 100,
    participants: 1876,
    difficulty: "Medium",
    rating: 4.6,
    attempts: 1245,
    image: "📚",
    bgGradient: "from-green-500 to-emerald-500",
    isPro: false,
    tags: ["Subject", "Literature", "Comprehensive"]
  },
  {
    id: 3,
    title: "Speed Test - 30 Minutes Challenge",
    description: "Test your speed and accuracy with this quick 30-minute assessment",
    duration: 30,
    questions: 50,
    participants: 3124,
    difficulty: "Mixed",
    rating: 4.7,
    attempts: 2890,
    image: "⚡",
    bgGradient: "from-orange-500 to-red-500",
    isPro: false,
    tags: ["Speed", "Quick", "Challenge"]
  }
]

export function FeaturedExams() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredExams.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredExams.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredExams.length) % featuredExams.length)
  }

  const exam = featuredExams[currentSlide]

  return (
    <div className="relative">
      <Card className="overflow-hidden border-0 shadow-2xl">
        <div className={cn(
          "relative h-48 bg-gradient-to-r",
          exam.bgGradient
        )}>
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-4 right-4 text-6xl opacity-20">
            {exam.image}
          </div>
          
          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
            {featuredExams.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentSlide ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{exam.title}</h2>
                {exam.isPro && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    PRO
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mb-4">{exam.description}</p>
            </div>
          </div>

          {/* Exam Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>{exam.duration} mins</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Zap className="h-4 w-4 text-orange-600" />
              <span>{exam.questions} Qs</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-green-600" />
              <span>{exam.participants.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-600 fill-yellow-400" />
              <span>{exam.rating}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {exam.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg">
              <Play className="h-4 w-4 mr-2" />
              Start Exam
            </Button>
            <Button variant="outline" className="flex-1">
              <Trophy className="h-4 w-4 mr-2" />
              View Leaderboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}