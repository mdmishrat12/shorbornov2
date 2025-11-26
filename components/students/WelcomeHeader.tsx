"use client"

import { useEffect, useState } from "react"
import { Bell, Crown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const motivationalQuotes = [
  "সফলতার কোনো শর্টকাট নেই, কেবল কঠোর পরিশ্রম আছে।",
  "প্রতিটি মহান achievement শুরু হয় একটি decision নেওয়া থেকে।",
  "আপনার লক্ষ্য নির্ধারণ করুন এবং সেটা অর্জন না করা পর্যন্ত থামবেন না।",
  "BCS পরীক্ষা শুধু জ্ঞানের পরীক্ষা নয়, ধৈর্য্যেরও পরীক্ষা।"
]

export function WelcomeHeader() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
        setIsVisible(true)
      }, 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-4 lg:p-6 text-white shadow-2xl">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 lg:w-32 lg:h-32 bg-white/10 rounded-full -translate-y-8 lg:-translate-y-16 translate-x-8 lg:translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 lg:w-24 lg:h-24 bg-white/10 rounded-full translate-y-8 lg:translate-y-12 -translate-x-8 lg:-translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2 lg:space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl lg:text-2xl font-bold">Good Morning! 🌤️</h1>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 hidden sm:flex">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            </div>
            
            <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <p className="text-blue-100 text-sm lg:text-base leading-relaxed max-w-2xl">
                {motivationalQuotes[currentQuote]}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs lg:text-sm flex-wrap">
              <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                <Zap className="h-3 w-3 lg:h-4 lg:w-4" />
                <span>42 day streak</span>
              </div>
              <div className="bg-white/20 px-2 py-1 rounded-full">
                🎯 75% Daily Goal
              </div>
            </div>
          </div>

          {/* Bell icon - hidden on smallest mobile, shown on larger screens */}
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hidden sm:flex">
            <Bell className="h-5 w-5 lg:h-6 lg:w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}