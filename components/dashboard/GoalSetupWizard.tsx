"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Target, 
  GraduationCap, 
  Building, 
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Star,
  Zap,
  Calendar,
  Clock,
  Users,
  Award,
  Bookmark,
  Lightbulb
} from "lucide-react"

const examTypes = [
  {
    id: "bcs",
    name: "BCS",
    description: "Bangladesh Civil Service",
    icon: GraduationCap,
    color: "from-blue-500 to-cyan-500",
    cadres: [
      { name: "Administration Cadre", competition: "High", posts: 200, salary: "৳80,000+" },
      { name: "Police Cadre", competition: "Very High", posts: 150, salary: "৳85,000+" },
      { name: "Foreign Cadre", competition: "Extreme", posts: 50, salary: "৳90,000+" },
      { name: "Taxation Cadre", competition: "High", posts: 100, salary: "৳78,000+" },
      { name: "Customs & Excise Cadre", competition: "Medium", posts: 80, salary: "৳75,000+" },
      { name: "Audit & Accounts Cadre", competition: "Medium", posts: 120, salary: "৳76,000+" }
    ]
  },
  {
    id: "bank",
    name: "Bank Job",
    description: "Bangladesh Bank & Commercial Banks",
    icon: Building,
    color: "from-green-500 to-emerald-500",
    positions: [
      { name: "Probationary Officer", competition: "Very High", salary: "৳65,000+", banks: ["All Scheduled Banks"] },
      { name: "Senior Officer", competition: "High", salary: "৳55,000+", banks: ["Private Banks"] },
      { name: "Assistant Officer", competition: "Medium", salary: "৳45,000+", banks: ["Private Banks"] },
      { name: "Cash Officer", competition: "Low", salary: "৳35,000+", banks: ["All Banks"] }
    ]
  },
  {
    id: "primary",
    name: "Primary Teacher",
    description: "Primary School Assistant Teacher",
    icon: BookOpen,
    color: "from-orange-500 to-red-500",
    categories: [
      { name: "Assistant Teacher (Primary)", competition: "High", posts: 5000, salary: "৳25,000+" },
      { name: "Head Teacher (Primary)", competition: "Medium", posts: 1000, salary: "৳35,000+" }
    ]
  },
  {
    id: "admission",
    name: "University Admission",
    description: "Public University Admission Tests",
    icon: Star,
    color: "from-purple-500 to-pink-500",
    universities: [
      { name: "University of Dhaka", competition: "Extreme", seats: 6000, units: ["A", "B", "C"] },
      { name: "BUET", competition: "Extreme", seats: 1200, units: ["A", "B"] },
      { name: "University of Chittagong", competition: "Very High", seats: 4000, units: ["A", "B", "C"] },
      { name: "Rajshahi University", competition: "High", seats: 3500, units: ["A", "B", "C"] },
      { name: "Jahangirnagar University", competition: "High", seats: 3000, units: ["A", "B"] },
      { name: "Khulna University", competition: "Medium", seats: 2000, units: ["A", "B"] }
    ]
  }
]

const subjectsByGoal = {
  bcs: [
    { name: "Bangla", marks: 35, priority: "high", chapters: 15 },
    { name: "English", marks: 35, priority: "high", chapters: 12 },
    { name: "Bangladesh Affairs", marks: 30, priority: "high", chapters: 20 },
    { name: "International Affairs", marks: 20, priority: "medium", chapters: 18 },
    { name: "General Science", marks: 15, priority: "medium", chapters: 10 },
    { name: "Computer & IT", marks: 15, priority: "medium", chapters: 8 },
    { name: "Mental Skills", marks: 50, priority: "high", chapters: 25 }
  ],
  bank: [
    { name: "English", marks: 40, priority: "high", chapters: 10 },
    { name: "Mathematics", marks: 35, priority: "high", chapters: 12 },
    { name: "General Knowledge", marks: 25, priority: "medium", chapters: 15 },
    { name: "Bangla", marks: 20, priority: "medium", chapters: 8 },
    { name: "Computer & IT", marks: 20, priority: "medium", chapters: 6 },
    { name: "Accounting", marks: 30, priority: "high", chapters: 14 },
    { name: "Banking & Finance", marks: 30, priority: "high", chapters: 16 }
  ],
  primary: [
    { name: "Bangla", marks: 40, priority: "high", chapters: 12 },
    { name: "English", marks: 35, priority: "high", chapters: 10 },
    { name: "Mathematics", marks: 30, priority: "high", chapters: 15 },
    { name: "General Knowledge", marks: 25, priority: "medium", chapters: 20 },
    { name: "Science", marks: 20, priority: "medium", chapters: 8 },
    { name: "Social Science", marks: 20, priority: "medium", chapters: 10 },
    { name: "Pedagogy", marks: 30, priority: "high", chapters: 12 }
  ],
  admission: [
    { name: "English", marks: 40, priority: "high", chapters: 8 },
    { name: "Mathematics", marks: 40, priority: "high", chapters: 16 },
    { name: "General Knowledge", marks: 20, priority: "medium", chapters: 12 },
    { name: "Physics", marks: 25, priority: "high", chapters: 14 },
    { name: "Chemistry", marks: 25, priority: "high", chapters: 12 },
    { name: "Biology", marks: 25, priority: "high", chapters: 15 },
    { name: "Bangla", marks: 25, priority: "medium", chapters: 10 }
  ]
}

const studyPlans = {
  bcs: {
    duration: "12 months",
    dailyStudy: "4-6 hours",
    weeklyTests: 2,
    fullMocks: 1,
    focusAreas: ["Current Affairs", "Mental Ability", "Bangladesh Studies"]
  },
  bank: {
    duration: "6 months", 
    dailyStudy: "3-5 hours",
    weeklyTests: 3,
    fullMocks: 2,
    focusAreas: ["English", "Mathematics", "Banking Knowledge"]
  },
  primary: {
    duration: "4 months",
    dailyStudy: "3-4 hours", 
    weeklyTests: 2,
    fullMocks: 1,
    focusAreas: ["Pedagogy", "Child Psychology", "Subject Knowledge"]
  },
  admission: {
    duration: "8 months",
    dailyStudy: "5-7 hours",
    weeklyTests: 4,
    fullMocks: 2,
    focusAreas: ["Mathematics", "Science", "English Grammar"]
  }
}

export function GoalSetupWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState("")
  const [selectedCadre, setSelectedCadre] = useState<any>(null)
  const [selectedUniversity, setSelectedUniversity] = useState<any>(null)
  const [studyDuration, setStudyDuration] = useState("6 months")

  const currentGoal = examTypes.find(g => g.id === selectedGoal)
  const subjects = subjectsByGoal[selectedGoal as keyof typeof subjectsByGoal] || []
  const studyPlan = studyPlans[selectedGoal as keyof typeof studyPlans]

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId)
    setCurrentStep(2)
  }

  const handleCadreSelect = (cadre: any) => {
    setSelectedCadre(cadre)
    setCurrentStep(3)
  }

  const handleUniversitySelect = (university: any) => {
    setSelectedUniversity(university)
    setCurrentStep(3)
  }

  const handleCompleteSetup = () => {
    const goalData = {
      type: selectedGoal,
      cadre: selectedCadre,
      university: selectedUniversity,
      subjects: subjects,
      studyPlan: studyPlan,
      duration: studyDuration,
      startDate: new Date().toISOString().split('T')[0]
    }
    
    console.log("Saving goal:", goalData)
    // API call to save goal
    // Then redirect to dashboard
  }

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case "Extreme": return "bg-red-100 text-red-700 border-red-200"
      case "Very High": return "bg-orange-100 text-orange-700 border-orange-200"
      case "High": return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Medium": return "bg-blue-100 text-blue-700 border-blue-200"
      default: return "bg-green-100 text-green-700 border-green-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700"
      case "medium": return "bg-orange-100 text-orange-700"
      default: return "bg-blue-100 text-blue-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Set Your Career Goal</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your target exam and we'll create a personalized study plan for you
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  ${step < currentStep ? 'bg-green-500 text-white' : 
                    step === currentStep ? 'bg-blue-500 text-white ring-4 ring-blue-200' : 
                    'bg-gray-300 text-gray-600'}
                `}>
                  {step < currentStep ? <CheckCircle2 className="h-5 w-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`
                    w-12 h-1 ${step < currentStep ? 'bg-green-500' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Goal Selection */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {examTypes.map((exam) => {
              const Icon = exam.icon
              return (
                <Card 
                  key={exam.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => handleGoalSelect(exam.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${exam.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{exam.name}</h3>
                        <p className="text-gray-600 text-sm">{exam.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Step 2: Cadre/Position Selection */}
        {currentStep === 2 && currentGoal && (
          <Card className="border-0 shadow-lg max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                Select Your Target {currentGoal.name === "BCS" ? "Cadre" : 
                                 currentGoal.name === "Bank Job" ? "Position" :
                                 currentGoal.name === "Primary Teacher" ? "Category" : "University"}
              </CardTitle>
              <CardDescription>
                Choose your preferred option for {currentGoal.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {(currentGoal.cadres || currentGoal.positions || currentGoal.categories || currentGoal.universities)?.map((option) => (
                  <Card
                    key={option.name}
                    className="border-2 cursor-pointer hover:border-blue-500 transition-all"
                    onClick={() => 
                      currentGoal.id === "admission" 
                        ? handleUniversitySelect(option)
                        : handleCadreSelect(option)
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Award className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{option.name}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <Badge className={getCompetitionColor(option.competition)}>
                                {option.competition} Competition
                              </Badge>
                              {option.salary && (
                                <span className="text-sm text-gray-600">{option.salary}</span>
                              )}
                              {option.posts && (
                                <span className="text-sm text-gray-600">{option.posts} posts</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Study Plan Confirmation */}
        {currentStep === 3 && (
          <Card className="border-0 shadow-lg max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Your Personalized Study Plan</CardTitle>
              <CardDescription>
                We've created a customized preparation roadmap based on your goal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Goal Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {currentGoal?.name} - {selectedCadre?.name || selectedUniversity?.name}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {selectedCadre?.competition && `Competition: ${selectedCadre.competition}`}
                      {selectedUniversity?.competition && `Competition: ${selectedUniversity.competition}`}
                    </p>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    Ready to Start
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Study Plan Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      Study Plan Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">{studyPlan.duration}</div>
                        <div className="text-sm text-gray-600">Duration</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Zap className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                        <div className="font-semibold text-gray-900">{studyPlan.dailyStudy}</div>
                        <div className="text-sm text-gray-600">Daily Study</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Weekly Tests</span>
                        <Badge variant="outline">{studyPlan.weeklyTests} tests/week</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Full Mock Tests</span>
                        <Badge variant="outline">{studyPlan.fullMocks} test/week</Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Adjust Study Duration
                      </label>
                      <select 
                        value={studyDuration}
                        onChange={(e) => setStudyDuration(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="3 months">3 Months (Intensive)</option>
                        <option value="6 months">6 Months (Standard)</option>
                        <option value="9 months">9 Months (Comfortable)</option>
                        <option value="12 months">12 Months (Detailed)</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                {/* Subjects & Focus Areas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bookmark className="h-5 w-5 text-green-600" />
                      Subjects & Focus Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {subjects.slice(0, 4).map((subject, index) => (
                        <div key={subject.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge className={getPriorityColor(subject.priority)}>
                              {subject.priority}
                            </Badge>
                            <span className="text-sm font-medium text-gray-900">{subject.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">{subject.marks} marks</div>
                            <div className="text-xs text-gray-600">{subject.chapters} chapters</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        <span className="font-semibold text-yellow-900">Focus Areas</span>
                      </div>
                      <div className="text-sm text-yellow-800">
                        {studyPlan.focusAreas.join(", ")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Diagnostic Test Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    Assessment Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-gray-900">Easy</div>
                      <div className="text-lg text-green-600 font-semibold">80%+</div>
                      <div className="text-sm text-gray-600 mt-1">20% Prepared</div>
                      <div className="text-xs text-gray-500">Basic concepts clear</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="text-2xl font-bold text-gray-900">Medium</div>
                      <div className="text-lg text-orange-600 font-semibold">70%+</div>
                      <div className="text-sm text-gray-600 mt-1">50% Prepared</div>
                      <div className="text-xs text-gray-500">Good understanding</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-2xl font-bold text-gray-900">Hard</div>
                      <div className="text-lg text-red-600 font-semibold">60%+</div>
                      <div className="text-sm text-gray-600 mt-1">80% Prepared</div>
                      <div className="text-xs text-gray-500">Advanced mastery</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setCurrentStep(2)}
                >
                  Go Back
                </Button>
                <Button 
                  onClick={handleCompleteSetup}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 text-lg"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Start My Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        {currentStep > 1 && currentStep < 3 && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              Go Back
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}