"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Clock, Target, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Questions Solved",
    value: "1,247",
    description: "+124 today",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    delay: 0
  },
  {
    title: "Study Time",
    value: "48h",
    description: "This month",
    icon: Clock,
    color: "text-green-600",
    bgColor: "bg-green-50",
    delay: 100
  },
  {
    title: "Accuracy",
    value: "72%",
    description: "+5% this week",
    icon: Target,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    delay: 200
  },
  {
    title: "Rank",
    value: "#156",
    description: "Top 3%",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    delay: 300
  }
]

export function StatsGrid() {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    setAnimated(true)
  }, [])

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className={`relative overflow-hidden transition-all duration-500 ${
            animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          } hover:shadow-lg hover:scale-105 cursor-pointer border-0 shadow-md`}
          style={{ transitionDelay: `${stat.delay}ms` }}
        >
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{stat.description}</p>
              </div>
              <div className={`p-2 lg:p-3 rounded-2xl ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}