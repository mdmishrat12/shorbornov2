"use client"

import { useState, useEffect } from 'react'

export interface PracticeFilters {
  subjects: string[]
  topics: string[]
  bcsExams: string[]
  difficulties: string[]
  questionTypes: string[]
  quickFilters: string[]
  weakTopics: string[]
  timeRange: [number, number]
  marksRange: [number, number]
}

export interface Question {
  id: string
  questionText: string
  questionTextBn?: string
  subject: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  bcsYear?: number
  bcsCadre?: string
  marks: number
  timeRequired: number
  attempts: number
  correctAttempts: number
  isBookmarked: boolean
  isMarked: boolean
  userAnswer?: string
  isCorrect?: boolean
  options: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
}

export function usePractice() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [selectedFilters, setSelectedFilters] = useState<PracticeFilters>({
    subjects: [],
    topics: [],
    bcsExams: [],
    difficulties: [],
    questionTypes: [],
    quickFilters: [],
    weakTopics: [],
    timeRange: [0, 300],
    marksRange: [1, 5]
  })

  // Mock data - Replace with actual API call
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        const mockQuestions: Question[] = Array.from({ length: 50 }, (_, i) => ({
          id: `q${i + 1}`,
          questionText: `BCS Preparation Question ${i + 1} about various subjects including Bangla, English, and General Knowledge?`,
          questionTextBn: i % 3 === 0 ? `বিসিএস প্রস্তুতি প্রশ্ন ${i + 1} বিভিন্ন বিষয় including বাংলা, ইংরেজি, and সাধারণ জ্ঞান?` : undefined,
          subject: ['Bangla', 'English', 'Math', 'General Knowledge', 'Science'][i % 5],
          topic: ['Grammar', 'Literature', 'Algebra', 'History', 'Physics'][i % 5],
          difficulty: ['easy', 'medium', 'hard'][i % 3] as 'easy' | 'medium' | 'hard',
          bcsYear: i % 4 === 0 ? 35 + (i % 5) : undefined,
          bcsCadre: i % 6 === 0 ? 'Administration' : undefined,
          marks: [1, 2][i % 2],
          timeRequired: 30 + (i % 60),
          attempts: Math.floor(Math.random() * 100),
          correctAttempts: Math.floor(Math.random() * 80),
          isBookmarked: i % 7 === 0,
          isMarked: i % 10 === 0,
          userAnswer: i % 3 === 0 ? 'option1' : undefined,
          isCorrect: i % 3 === 0 ? Math.random() > 0.5 : undefined,
          options: [
            { id: 'option1', text: 'Correct answer for this question', isCorrect: true },
            { id: 'option2', text: 'Incorrect option one', isCorrect: false },
            { id: 'option3', text: 'Incorrect option two', isCorrect: false },
            { id: 'option4', text: 'Incorrect option three', isCorrect: false }
          ]
        }))
        setQuestions(mockQuestions)
        setFilteredQuestions(mockQuestions)
        setIsLoading(false)
      }, 1000)
    }

    loadQuestions()
  }, [])

  // Filter questions based on selected filters and search
  useEffect(() => {
    let filtered = questions

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.questionTextBn && q.questionTextBn.includes(searchQuery)) ||
        q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Subject filter
    if (selectedFilters.subjects.length > 0) {
      filtered = filtered.filter(q => selectedFilters.subjects.includes(q.subject))
    }

    // Topic filter
    if (selectedFilters.topics.length > 0) {
      filtered = filtered.filter(q => selectedFilters.topics.includes(q.topic))
    }

    // Difficulty filter
    if (selectedFilters.difficulties.length > 0) {
      filtered = filtered.filter(q => selectedFilters.difficulties.includes(q.difficulty))
    }

    // BCS Exam filter
    if (selectedFilters.bcsExams.length > 0) {
      filtered = filtered.filter(q => 
        q.bcsYear && selectedFilters.bcsExams.includes(q.bcsYear.toString())
      )
    }

    // Quick filters
    if (selectedFilters.quickFilters.includes('weak_topics')) {
      // Filter weak topics (accuracy < 50%)
      filtered = filtered.filter(q => {
        const accuracy = q.attempts > 0 ? (q.correctAttempts / q.attempts) * 100 : 0
        return accuracy < 50
      })
    }

    if (selectedFilters.quickFilters.includes('unattempted')) {
      filtered = filtered.filter(q => q.userAnswer === undefined)
    }

    if (selectedFilters.quickFilters.includes('marked')) {
      filtered = filtered.filter(q => q.isMarked)
    }

    if (selectedFilters.quickFilters.includes('incorrect')) {
      filtered = filtered.filter(q => q.isCorrect === false)
    }

    if (selectedFilters.quickFilters.includes('time_consuming')) {
      filtered = filtered.filter(q => q.timeRequired > 60)
    }

    setFilteredQuestions(filtered)
  }, [questions, selectedFilters, searchQuery])

  const toggleFilter = (filterType: keyof PracticeFilters, value: string) => {
    setSelectedFilters(prev => {
      const currentArray = prev[filterType] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      
      return { ...prev, [filterType]: newArray }
    })
  }

  const toggleQuickFilter = (value: string) => {
    toggleFilter('quickFilters', value)
  }

  const clearAllFilters = () => {
    setSelectedFilters({
      subjects: [],
      topics: [],
      bcsExams: [],
      difficulties: [],
      questionTypes: [],
      quickFilters: [],
      weakTopics: [],
      timeRange: [0, 300],
      marksRange: [1, 5]
    })
    setSearchQuery('')
  }

  const loadMoreQuestions = () => {
    // Implement pagination
    console.log('Loading more questions...')
  }

  const activeFilterCount = Object.values(selectedFilters).reduce((count, filter) => {
    if (Array.isArray(filter)) {
      return count + filter.length
    }
    return count
  }, 0)

  const hasSearchResults = searchQuery.length > 0 && filteredQuestions.length === 0
const hasActiveFilters = activeFilterCount > 0 && filteredQuestions.length === 0
const isEmptyBank = questions.length === 0

  return {
    questions,
    filteredQuestions,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedFilters,
    toggleFilter,
    toggleQuickFilter,
    clearAllFilters,
    loadMoreQuestions,
    hasMore: filteredQuestions.length < questions.length,
    totalQuestions: questions.length,
    activeFilterCount,
     hasSearchResults,
  hasActiveFilters, 
  isEmptyBank
  }
}