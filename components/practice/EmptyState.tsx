"use client"

import { Search, FilterX, BookOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { usePractice } from "@/hooks/usePractice"

interface EmptyStateProps {
  filters: any
}

export function EmptyState({ filters }: EmptyStateProps) {
  const { clearAllFilters, searchQuery } = usePractice()

  const hasActiveFilters = Object.values(filters).some((filter: any) => {
    if (Array.isArray(filter)) return filter.length > 0
    return false
  })

  const getEmptyStateConfig = () => {
    if (searchQuery && hasActiveFilters) {
      return {
        icon: Search,
        title: "No questions found",
        description: "We couldn't find any questions matching your search and filters.",
        action: clearAllFilters,
        actionText: "Clear all filters",
        secondaryAction: null
      }
    }

    if (searchQuery) {
      return {
        icon: Search,
        title: "No questions found",
        description: `We couldn't find any questions matching "${searchQuery}". Try searching with different keywords.`,
        action: () => { /* Clear search logic */ },
        actionText: "Clear search",
        secondaryAction: null
      }
    }

    if (hasActiveFilters) {
      return {
        icon: FilterX,
        title: "No questions match your filters",
        description: "Try adjusting your filters to see more questions. Your current filters are too specific.",
        action: clearAllFilters,
        actionText: "Clear all filters",
        secondaryAction: null
      }
    }

    return {
      icon: BookOpen,
      title: "No questions available",
      description: "There are no questions available in the selected category. Check back later or try different subjects.",
      action: clearAllFilters,
      actionText: "Browse all questions",
      secondaryAction: null
    }
  }

  const config = getEmptyStateConfig()

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden">
      <CardContent className="p-8 lg:p-12">
        <div className="text-center max-w-md mx-auto">
          {/* Animated Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg border">
                <config.icon className="h-10 w-10 text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs">
                  <Plus className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
            {config.title}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {config.description}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={config.action}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg"
            >
              {config.actionText}
            </Button>
            
            {config.secondaryAction && (
              <Button variant="outline" onClick={config.secondaryAction}>
                Browse All Subjects
              </Button>
            )}
          </div>

          {/* Quick Tips */}
          <div className="mt-8 p-4 bg-white/50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">💡 Quick Tips:</h4>
            <ul className="text-xs text-blue-800 space-y-1 text-left">
              <li>• Try using fewer filters to see more questions</li>
              <li>• Check your spelling in the search bar</li>
              <li>• Browse different subjects and topics</li>
              <li>• Clear all filters to see the complete question bank</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}