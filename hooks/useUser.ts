"use client"

import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  goal?: {
    type: string
    cadre: string
    university?: string
    subjects: string[]
    startDate: string
    targetDate: string
  }
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to get user data
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        // In real app, this would be an API call
        const userData: User = {
          id: "1",
          name: "John Doe", 
          email: "john@example.com",
          // goal: { // Uncomment to test study plan dashboard
          //   type: "BCS",
          //   cadre: "Administration Cadre",
          //   subjects: ["Bangla", "English", "Mathematics"],
          //   startDate: "2024-01-15",
          //   targetDate: "2024-12-31"
          // }
        }
        setUser(userData)
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, isLoading }
}