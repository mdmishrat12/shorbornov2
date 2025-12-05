"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, Target, Zap, Star, Clock } from "lucide-react"

const diagnosticLevels = [
  {
    level: "easy",
    name: "Basic Assessment",
    description: "Test your fundamental knowledge",
    questions: 20,
    duration: 30,
    passing: 80,
    color: "from-green-500 to-emerald-500",
    icon: Zap
  },
  {
    level: "medium", 
    name: "Intermediate Assessment",
    description: "Evaluate your conceptual understanding",
    questions: 20,
    duration: 35,
    passing: 70,
    color: "from-orange-500 to-amber-500",
    icon: Target
  },
  {
    level: "hard",
    name: "Advanced Assessment", 
    description: "Challenge your advanced knowledge",
    questions: 20,
    duration: 40,
    passing: 60,
    color: "from-red-500 to-pink-500",
    icon: Star
  }
]

interface DiagnosticTestProps {
  onClose: () => void
}

export function DiagnosticTest({ onClose }: DiagnosticTestProps) {
  const [selectedLevel, setSelectedLevel] = useState("")
  const [showInstructions, setShowInstructions] = useState(false)

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level)
    setShowInstructions(true)
  }

  const handleStartTest = () => {
    // Navigate to test page
    console.log("Starting", selectedLevel, "diagnostic test")
    // router.push(`/student/diagnostic/${selectedLevel}`)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="border-0 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              Diagnostic Assessment
            </CardTitle>
            <CardDescription>
              Take assessment tests to measure your current preparation level
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {!showInstructions ? (
            <>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Choose Assessment Level
                </h3>
                <p className="text-gray-600">
                  Start with easier levels and progress to advanced assessments
                </p>
              </div>

              <div className="space-y-4">
                {diagnosticLevels.map((level) => {
                  const Icon = level.icon
                  return (
                    <Card 
                      key={level.level}
                      className="border-2 cursor-pointer hover:border-blue-500 transition-all"
                      onClick={() => handleLevelSelect(level.level)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${level.color}`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{level.name}</h4>
                              <Badge className={`
                                ${level.level === 'easy' ? 'bg-green-100 text-green-700' :
                                  level.level === 'medium' ? 'bg-orange-100 text-orange-700' :
                                  'bg-red-100 text-red-700'}
                              `}>
                                {level.level.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{level.description}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                {level.questions} questions
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {level.duration} minutes
                              </span>
                              <span>Passing: {level.passing}%</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">{level.passing}%</div>
                            <div className="text-sm text-gray-600">Required</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Assessment Strategy</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span><strong>Easy (80%+):</strong> 20% prepared - Basic concepts clear</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span><strong>Medium (70%+):</strong> 50% prepared - Good conceptual understanding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span><strong>Hard (60%+):</strong> 80% prepared - Advanced level mastery</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {diagnosticLevels.find(l => l.level === selectedLevel)?.name}
                </h3>
                <p className="text-gray-600">Read the instructions carefully before starting</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">
                      {diagnosticLevels.find(l => l.level === selectedLevel)?.questions}
                    </div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">
                      {diagnosticLevels.find(l => l.level === selectedLevel)?.duration}
                    </div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">
                      {diagnosticLevels.find(l => l.level === selectedLevel)?.passing}%
                    </div>
                    <div className="text-sm text-gray-600">Passing Score</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Instructions:</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                      <span>This test contains multiple choice questions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                      <span>Each question carries 1 mark</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                      <span>There is no negative marking</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                      <span>You cannot pause the test once started</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                      <span>Use the question palette to navigate between questions</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowInstructions(false)}
                  >
                    Go Back
                  </Button>
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleStartTest}
                  >
                    Start Assessment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}