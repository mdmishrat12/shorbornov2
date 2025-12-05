"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Edit3, 
  Save, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  Shield,
  Bell,
  Lock,
  Download,
  Share,
  Loader2,
  X
} from "lucide-react"
import { useUserProfile } from "@/hooks/useUserProfile"
import { toast } from "sonner"

// Default data structure
const defaultUserData = {
  personal: {
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "Male",
    address: "",
    avatar: "U",
    joinDate: ""
  },
  academic: {
    institution: "",
    degree: "",
    graduationYear: "",
    cgpa: "",
    bcsExam: "44th BCS",
    targetCadre: "Administration Cadre",
    preparationStart: "",
    studyHours: "4-6 hours daily"
  },
  stats: {
    examsTaken: 0,
    totalQuestions: 0,
    averageScore: 0,
    accuracy: 0,
    currentRank: 0,
    improvement: 0,
    streak: 0,
    studyTime: "0h 0m"
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    studyReminders: true,
    weeklyReports: true,
    publicProfile: true,
    language: "English",
    theme: "Light"
  },
  subscription: {
    plan: "Free",
    status: "Active",
    since: "",
    expires: "",
    features: ["Basic Tests", "Progress Tracking"]
  }
}

export function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(defaultUserData)

  const { profile, isLoading, updateProfile, isUpdating } = useUserProfile()

  // Update form data when profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    try {
      await updateProfile({
        personal: formData.personal,
        academic: formData.academic,
        preferences: formData.preferences
      })
      setIsEditing(false)
    } catch (error) {
      // Error handling is done in the mutation
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData(profile)
    }
    setIsEditing(false)
  }

  const handleExportData = async () => {
    try {
      const dataStr = JSON.stringify(profile, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `shorborno-profile-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Data exported successfully')
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  const handleChangePassword = () => {
    toast.info('Password change feature coming soon!')
  }

  const handleUpgradePlan = () => {
    toast.info('Plan upgrade feature coming soon!')
  }

  const handleManageSubscription = () => {
    toast.info('Subscription management coming soon!')
  }

  const handleCancelSubscription = () => {
    toast.info('Subscription cancellation coming soon!')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {formData.personal.name ? formData.personal.name.split(' ').map(n => n[0]).join('') : 'U'}
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50">
                  <Camera className="h-5 w-5 text-gray-600" />
                </button>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.personal.name}
                      onChange={(e) => handleInputChange("personal", "name", e.target.value)}
                      className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-1 min-w-[200px]"
                      placeholder="Enter your name"
                    />
                  ) : (
                    formData.personal.name || "Anonymous User"
                  )}
                </h1>
                <Badge className={`${
                  formData.subscription.plan === 'Premium' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : formData.subscription.plan === 'Pro'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-gray-500'
                } text-white`}>
                  {formData.subscription.plan}
                </Badge>
              </div>
              <p className="text-gray-600 mb-2">
                BCS Aspirant • Member since {formData.personal.joinDate || "recently"}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  Rank #{formData.stats.currentRank || "N/A"}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {formData.stats.improvement || 0}% improvement
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {formData.stats.streak || 0} day streak
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave} 
                  disabled={isUpdating}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel} 
                  disabled={isUpdating}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setIsEditing(true)} 
                  className="flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleExportData}
                >
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Academic
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Subscription
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Your basic profile details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Email</div>
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.personal.email}
                          onChange={(e) => handleInputChange("personal", "email", e.target.value)}
                          className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-1"
                          placeholder="Enter your email"
                        />
                      ) : (
                        <div className="font-medium text-gray-900">{formData.personal.email || "Not set"}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Phone</div>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.personal.phone}
                          onChange={(e) => handleInputChange("personal", "phone", e.target.value)}
                          className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-1"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="font-medium text-gray-900">{formData.personal.phone || "Not set"}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Address</div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.personal.address}
                          onChange={(e) => handleInputChange("personal", "address", e.target.value)}
                          className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-1"
                          placeholder="Enter your address"
                        />
                      ) : (
                        <div className="font-medium text-gray-900">{formData.personal.address || "Not set"}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Date of Birth</div>
                      {isEditing ? (
                        <input
                          type="date"
                          value={formData.personal.dateOfBirth}
                          onChange={(e) => handleInputChange("personal", "dateOfBirth", e.target.value)}
                          className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-1"
                        />
                      ) : (
                        <div className="font-medium text-gray-900">{formData.personal.dateOfBirth || "Not set"}</div>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <div className="text-sm text-gray-600">Gender</div>
                        <select
                          value={formData.personal.gender}
                          onChange={(e) => handleInputChange("personal", "gender", e.target.value)}
                          className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-1"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Performance Stats */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Performance Stats
                  </CardTitle>
                  <CardDescription>Your learning progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{formData.stats.examsTaken}</div>
                      <div className="text-sm text-gray-600">Exams Taken</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{formData.stats.averageScore}%</div>
                      <div className="text-sm text-gray-600">Avg. Score</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{formData.stats.accuracy}%</div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{formData.stats.streak}</div>
                      <div className="text-sm text-gray-600">Day Streak</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Overall Progress</span>
                        <span className="font-semibold text-gray-900">{formData.stats.averageScore}%</span>
                      </div>
                      <Progress value={formData.stats.averageScore} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Question Accuracy</span>
                        <span className="font-semibold text-gray-900">{formData.stats.accuracy}%</span>
                      </div>
                      <Progress value={formData.stats.accuracy} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Study Goals */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    Study Goals
                  </CardTitle>
                  <CardDescription>Your BCS preparation targets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">Target Cadre</span>
                      <Badge variant="outline" className="bg-blue-50">
                        {formData.academic.targetCadre}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">BCS Exam</span>
                      <Badge variant="outline" className="bg-green-50">
                        {formData.academic.bcsExam}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">Study Hours</span>
                      <Badge variant="outline" className="bg-purple-50">
                        {formData.academic.studyHours}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-blue-900 mb-1">Current Focus</div>
                    <div className="text-xs text-blue-700">
                      {formData.stats.examsTaken > 0 
                        ? "Improving accuracy in General Knowledge and International Affairs"
                        : "Start your first exam to see personalized focus areas"
                      }
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Update Goals
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Academic Tab */}
          <TabsContent value="academic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Education Background</CardTitle>
                  <CardDescription>Your academic qualifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Institution</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.academic.institution}
                        onChange={(e) => handleInputChange("academic", "institution", e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your institution"
                      />
                    ) : (
                      <div className="font-medium text-gray-900 mt-1">
                        {formData.academic.institution || "Not set"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Degree</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.academic.degree}
                        onChange={(e) => handleInputChange("academic", "degree", e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your degree"
                      />
                    ) : (
                      <div className="font-medium text-gray-900 mt-1">
                        {formData.academic.degree || "Not set"}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Graduation Year</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.academic.graduationYear}
                          onChange={(e) => handleInputChange("academic", "graduationYear", e.target.value)}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 2018"
                        />
                      ) : (
                        <div className="font-medium text-gray-900 mt-1">
                          {formData.academic.graduationYear || "Not set"}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">CGPA</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.academic.cgpa}
                          onChange={(e) => handleInputChange("academic", "cgpa", e.target.value)}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., 3.75"
                        />
                      ) : (
                        <div className="font-medium text-gray-900 mt-1">
                          {formData.academic.cgpa || "Not set"}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>BCS Preparation</CardTitle>
                  <CardDescription>Your civil service exam goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Target BCS Exam</label>
                    {isEditing ? (
                      <select
                        value={formData.academic.bcsExam}
                        onChange={(e) => handleInputChange("academic", "bcsExam", e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="44th BCS">44th BCS</option>
                        <option value="45th BCS">45th BCS</option>
                        <option value="46th BCS">46th BCS</option>
                        <option value="47th BCS">47th BCS</option>
                      </select>
                    ) : (
                      <div className="font-medium text-gray-900 mt-1">{formData.academic.bcsExam}</div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Target Cadre</label>
                    {isEditing ? (
                      <select
                        value={formData.academic.targetCadre}
                        onChange={(e) => handleInputChange("academic", "targetCadre", e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Administration Cadre">Administration Cadre</option>
                        <option value="Police Cadre">Police Cadre</option>
                        <option value="Foreign Cadre">Foreign Cadre</option>
                        <option value="Taxation Cadre">Taxation Cadre</option>
                        <option value="Customs & Excise Cadre">Customs & Excise Cadre</option>
                        <option value="Education Cadre">Education Cadre</option>
                      </select>
                    ) : (
                      <div className="font-medium text-gray-900 mt-1">{formData.academic.targetCadre}</div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Preparation Started</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.academic.preparationStart}
                        onChange={(e) => handleInputChange("academic", "preparationStart", e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 2023"
                      />
                    ) : (
                      <div className="font-medium text-gray-900 mt-1">
                        {formData.academic.preparationStart || "Not set"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Daily Study Hours</label>
                    {isEditing ? (
                      <select
                        value={formData.academic.studyHours}
                        onChange={(e) => handleInputChange("academic", "studyHours", e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="1-2 hours daily">1-2 hours daily</option>
                        <option value="2-4 hours daily">2-4 hours daily</option>
                        <option value="4-6 hours daily">4-6 hours daily</option>
                        <option value="6-8 hours daily">6-8 hours daily</option>
                        <option value="8+ hours daily">8+ hours daily</option>
                      </select>
                    ) : (
                      <div className="font-medium text-gray-900 mt-1">{formData.academic.studyHours}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "emailNotifications", label: "Email Notifications", description: "Receive updates via email" },
                    { key: "pushNotifications", label: "Push Notifications", description: "Get push notifications on your device" },
                    { key: "studyReminders", label: "Study Reminders", description: "Daily study session reminders" },
                    { key: "weeklyReports", label: "Weekly Reports", description: "Weekly performance summary" },
                    { key: "publicProfile", label: "Public Profile", description: "Make your profile visible to others" }
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between py-2">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{pref.label}</div>
                        <div className="text-sm text-gray-600">{pref.description}</div>
                      </div>
                      {isEditing ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.preferences[pref.key as keyof typeof formData.preferences] as boolean}
                            onChange={(e) => handleInputChange("preferences", pref.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      ) : (
                        <div className={`w-3 h-3 rounded-full ${
                          formData.preferences[pref.key as keyof typeof formData.preferences] 
                            ? 'bg-green-500' 
                            : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Language</label>
                    {isEditing ? (
                      <select
                        value={formData.preferences.language}
                        onChange={(e) => handleInputChange("preferences", "language", e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="English">English</option>
                        <option value="Bangla">Bangla</option>
                      </select>
                    ) : (
                      <div className="font-medium text-gray-900 mt-1">{formData.preferences.language}</div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Theme</label>
                    {isEditing ? (
                      <select
                        value={formData.preferences.theme}
                        onChange={(e) => handleInputChange("preferences", "theme", e.target.value)}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Light">Light</option>
                        <option value="Dark">Dark</option>
                        <option value="System">System</option>
                      </select>
                    ) : (
                      <div className="font-medium text-gray-900 mt-1">{formData.preferences.theme}</div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={handleChangePassword}
                    >
                      <Lock className="h-4 w-4" />
                      Change Password
                    </Button>
                  </div>

                  <div>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center gap-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                      onClick={handleExportData}
                    >
                      <Download className="h-4 w-4" />
                      Download My Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Subscription Plan
                </CardTitle>
                <CardDescription>Your current subscription details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="text-sm font-medium text-gray-600">Current Plan</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{formData.subscription.plan}</div>
                        <Badge className={`${
                          formData.subscription.status === 'Active' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        } mt-2`}>
                          {formData.subscription.status}
                        </Badge>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                        <div className="text-sm font-medium text-gray-600">Expires On</div>
                        <div className="text-xl font-bold text-gray-900 mt-1">
                          {formData.subscription.expires || "Never"}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {formData.subscription.plan === 'Free' ? 'Free forever' : 'Auto-renewal enabled'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Plan Features</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {formData.subscription.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={handleUpgradePlan}
                    >
                      Upgrade Plan
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleManageSubscription}
                    >
                      Manage Subscription
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleCancelSubscription}
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}