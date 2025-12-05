"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  BookOpen, 
  Settings, 
  Save,
  Trash2,
  Edit3,
  CheckCircle,
  Clock,
  Target
} from "lucide-react"
import { defaultSyllabus, defaultLessons } from "@/lib/data/default-syllabus"
import { toast } from "sonner"

interface Subject {
  id: string
  name: string
  description: string
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  estimatedMarks: number
  importance: 'low' | 'medium' | 'high'
}

export function CourseCreator() {
  const [activeTab, setActiveTab] = useState("basic")
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "BCS",
    thumbnail: "",
    useDefaultSyllabus: true
  })
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [editingSubject, setEditingSubject] = useState<string | null>(null)

  // Initialize with default syllabus when category changes
  const initializeDefaultSyllabus = () => {
    const defaultSubjects = defaultSyllabus[courseData.category as keyof typeof defaultSyllabus] || []
    const initializedSubjects = defaultSubjects.map((subject, index) => ({
      id: `subject-${index}`,
      name: subject.name,
      description: subject.description,
      lessons: defaultLessons[subject.name as keyof typeof defaultLessons]?.map((lesson, lessonIndex) => ({
        id: `lesson-${index}-${lessonIndex}`,
        title: lesson.title,
        estimatedMarks: lesson.estimatedMarks,
        importance: lesson.importance
      })) || []
    }))
    setSubjects(initializedSubjects)
  }

  const handleCategoryChange = (category: string) => {
    setCourseData(prev => ({ ...prev, category }))
    if (courseData.useDefaultSyllabus) {
      setTimeout(() => initializeDefaultSyllabus(), 100)
    }
  }

  const addCustomSubject = () => {
    const newSubject: Subject = {
      id: `subject-${Date.now()}`,
      name: "",
      description: "",
      lessons: []
    }
    setSubjects(prev => [...prev, newSubject])
    setEditingSubject(newSubject.id)
  }

  const updateSubject = (subjectId: string, field: string, value: string) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === subjectId ? { ...subject, [field]: value } : subject
    ))
  }

  const deleteSubject = (subjectId: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== subjectId))
  }

  const addLesson = (subjectId: string) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: "",
      estimatedMarks: 0,
      importance: 'medium'
    }
    setSubjects(prev => prev.map(subject => 
      subject.id === subjectId 
        ? { ...subject, lessons: [...subject.lessons, newLesson] }
        : subject
    ))
  }

  const updateLesson = (subjectId: string, lessonId: string, field: string, value: any) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === subjectId 
        ? { 
            ...subject, 
            lessons: subject.lessons.map(lesson => 
              lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
            )
          }
        : subject
    ))
  }

  const deleteLesson = (subjectId: string, lessonId: string) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === subjectId 
        ? { ...subject, lessons: subject.lessons.filter(lesson => lesson.id !== lessonId) }
        : subject
    ))
  }

  const saveCourse = async () => {
    try {
      // Validate course data
      if (!courseData.title.trim()) {
        toast.error("Course title is required")
        return
      }

      if (subjects.length === 0) {
        toast.error("Add at least one subject")
        return
      }

      // Save course to database
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: courseData,
          subjects: subjects
        }),
      })

      if (response.ok) {
        toast.success('Course created successfully!')
        // Reset form or redirect
      } else {
        throw new Error('Failed to create course')
      }
    } catch (error) {
      toast.error('Failed to create course')
      console.error(error)
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600 mt-2">Design your course structure and syllabus</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="syllabus" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Syllabus
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
                <CardDescription>Basic details about your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Course Title</label>
                  <Input
                    value={courseData.title}
                    onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., BCS Preliminary Preparation 2024"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <Textarea
                    value={courseData.description}
                    onChange={(e:any) => setCourseData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what students will learn in this course..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={courseData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="BCS">BCS</option>
                    <option value="Bank">Bank Job</option>
                    <option value="Primary Teacher">Primary Teacher</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useDefaultSyllabus"
                    checked={courseData.useDefaultSyllabus}
                    onChange={(e) => {
                      setCourseData(prev => ({ ...prev, useDefaultSyllabus: e.target.checked }))
                      if (e.target.checked) {
                        initializeDefaultSyllabus()
                      }
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="useDefaultSyllabus" className="text-sm text-gray-700">
                    Use default syllabus for {courseData.category}
                  </label>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("syllabus")}>
                Next: Syllabus
              </Button>
            </div>
          </TabsContent>

          {/* Syllabus Tab */}
          <TabsContent value="syllabus" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Course Syllabus</span>
                  <Button onClick={addCustomSubject} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Subject
                  </Button>
                </CardTitle>
                <CardDescription>
                  Organize your course into subjects and lessons
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {subjects.map((subject, subjectIndex) => (
                  <div key={subject.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      {editingSubject === subject.id ? (
                        <div className="flex-1 space-y-2">
                          <Input
                            value={subject.name}
                            onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                            placeholder="Subject name"
                          />
                          <Input
                            value={subject.description}
                            onChange={(e) => updateSubject(subject.id, 'description', e.target.value)}
                            placeholder="Subject description"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => setEditingSubject(null)}
                            className="mt-2"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {subjectIndex + 1}. {subject.name || "Untitled Subject"}
                          </h3>
                          {subject.description && (
                            <p className="text-gray-600 mt-1">{subject.description}</p>
                          )}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSubject(subject.id)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteSubject(subject.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Lessons */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Lessons</h4>
                        <Button
                          size="sm"
                          onClick={() => addLesson(subject.id)}
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Add Lesson
                        </Button>
                      </div>

                      {subject.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500 w-6">{lessonIndex + 1}.</span>
                              <input
                                type="text"
                                value={lesson.title}
                                onChange={(e) => updateLesson(subject.id, lesson.id, 'title', e.target.value)}
                                placeholder="Lesson title"
                                className="bg-transparent border-none focus:outline-none focus:ring-0 flex-1"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <select
                              value={lesson.importance}
                              onChange={(e) => updateLesson(subject.id, lesson.id, 'importance', e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                            <div className="flex items-center gap-1">
                              <Target className="h-4 w-4 text-gray-400" />
                              <input
                                type="number"
                                value={lesson.estimatedMarks}
                                onChange={(e) => updateLesson(subject.id, lesson.id, 'estimatedMarks', parseInt(e.target.value) || 0)}
                                className="w-12 text-sm border border-gray-300 rounded px-2 py-1"
                                min="0"
                                max="10"
                              />
                              <span className="text-sm text-gray-500">marks</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteLesson(subject.id, lesson.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {subjects.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects added</h3>
                    <p className="text-gray-600 mb-4">Start by adding your first subject to organize the course content.</p>
                    <Button onClick={addCustomSubject} className="flex items-center gap-2 mx-auto">
                      <Plus className="h-4 w-4" />
                      Add First Subject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("basic")}>
                Previous: Basic Info
              </Button>
              <Button variant="outline" onClick={() => setActiveTab("preview")}>
                Next: Preview
              </Button>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Preview</CardTitle>
                <CardDescription>Review your course before publishing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Course Overview */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{courseData.title || "Untitled Course"}</h2>
                    <Badge className="mb-4">{courseData.category}</Badge>
                    <p className="text-gray-600 mb-4">{courseData.description || "No description provided"}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{subjects.length}</div>
                        <div className="text-gray-600">Subjects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {subjects.reduce((total, subject) => total + subject.lessons.length, 0)}
                        </div>
                        <div className="text-gray-600">Lessons</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {subjects.reduce((total, subject) => 
                            total + subject.lessons.reduce((sum, lesson) => sum + lesson.estimatedMarks, 0), 0
                          )}
                        </div>
                        <div className="text-gray-600">Total Marks</div>
                      </div>
                    </div>
                  </div>

                  {/* Syllabus Preview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Syllabus Structure</h3>
                    {subjects.map((subject, subjectIndex) => (
                      <div key={subject.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          {subjectIndex + 1}. {subject.name || "Untitled Subject"}
                        </h4>
                        {subject.description && (
                          <p className="text-gray-600 mb-3">{subject.description}</p>
                        )}
                        
                        <div className="space-y-2">
                          {subject.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500">{lessonIndex + 1}.</span>
                                <span className="font-medium">{lesson.title || "Untitled Lesson"}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge className={getImportanceColor(lesson.importance)}>
                                  {lesson.importance}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <Target className="h-4 w-4" />
                                  {lesson.estimatedMarks} marks
                                </div>
                                <Button size="sm" variant="outline">
                                  Take Exam
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("syllabus")}>
                Previous: Syllabus
              </Button>
              <Button onClick={saveCourse} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Create Course
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}