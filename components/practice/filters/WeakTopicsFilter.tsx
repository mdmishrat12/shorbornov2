"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { usePractice } from "@/hooks/usePractice"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Target, TrendingUp, Zap } from "lucide-react"

// Mock weak topics data - Replace with actual user performance data
const weakTopicsData = [
  { topic: "International Affairs", accuracy: 32, questions: 45, improvement: -5 },
  { topic: "Bangla Literature", accuracy: 41, questions: 38, improvement: 2 },
  { topic: "Computer & IT", accuracy: 48, questions: 52, improvement: 8 },
  { topic: "Geometry", accuracy: 35, questions: 28, improvement: -2 },
  { topic: "English Vocabulary", accuracy: 44, questions: 67, improvement: 12 },
  { topic: "Bangladesh History", accuracy: 39, questions: 41, improvement: 3 },
  { topic: "Physics", accuracy: 37, questions: 33, improvement: -8 },
  { topic: "Statistics", accuracy: 42, questions: 25, improvement: 15 }
]

export function WeakTopicsFilter() {
  const { selectedFilters, toggleFilter } = usePractice()
  const [showAll, setShowAll] = useState(false)

  // Sort by accuracy (lowest first) and get weak topics (accuracy < 50%)
  const weakTopics = weakTopicsData
    .filter(topic => topic.accuracy < 50)
    .sort((a, b) => a.accuracy - b.accuracy)

  const displayTopics = showAll ? weakTopics : weakTopics.slice(0, 4)

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy < 35) return "text-red-600 bg-red-50 border-red-200"
    if (accuracy < 45) return "text-orange-600 bg-orange-50 border-orange-200"
    return "text-yellow-600 bg-yellow-50 border-yellow-200"
  }

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 5) return <TrendingUp className="h-3 w-3 text-green-500" />
    if (improvement < -5) return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
    return <Target className="h-3 w-3 text-gray-500" />
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          Weak Topics
        </h3>
        {selectedFilters.weakTopics.length > 0 && (
          <span className="text-xs text-blue-600 font-medium">
            {selectedFilters.weakTopics.length} selected
          </span>
        )}
      </div>

      <div className="space-y-2">
        {displayTopics.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            <Zap className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p>Great job! You don't have any weak topics.</p>
            <p className="text-xs mt-1">Keep up the good work! 🎉</p>
          </div>
        ) : (
          <>
            {displayTopics.map((topic) => {
              const isSelected = selectedFilters.weakTopics.includes(topic.topic)

              return (
                <div
                  key={topic.topic}
                  className={`
                    relative p-3 rounded-lg border cursor-pointer transition-all
                    ${isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-gray-300'}
                  `}
                  onClick={() => toggleFilter('weakTopics', topic.topic)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Label className="font-medium text-sm cursor-pointer truncate">
                          {topic.topic}
                        </Label>
                        <Badge 
                          variant="outline" 
                          className={`text-xs border ${getAccuracyColor(topic.accuracy)}`}
                        >
                          {topic.accuracy}%
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{topic.questions} questions</span>
                        <div className="flex items-center gap-1">
                          {getImprovementIcon(topic.improvement)}
                          <span className={topic.improvement > 0 ? 'text-green-600' : topic.improvement < 0 ? 'text-red-600' : 'text-gray-600'}>
                            {topic.improvement > 0 ? '+' : ''}{topic.improvement}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div 
                          className={`h-1.5 rounded-full ${
                            topic.accuracy < 35 ? 'bg-red-500' :
                            topic.accuracy < 45 ? 'bg-orange-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${topic.accuracy}%` }}
                        />
                      </div>
                    </div>
                    
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleFilter('weakTopics', topic.topic)}
                      className="ml-2 mt-0.5"
                    />
                  </div>
                </div>
              )
            })}
          </>
        )}

        {/* Show More/Less Toggle */}
        {weakTopics.length > 4 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="w-full text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            {showAll ? `Show Less` : `Show More Weak Topics (${weakTopics.length - 4} more)`}
          </Button>
        )}
      </div>

      {/* Actions */}
      {weakTopics.length > 0 && (
        <div className="pt-2 border-t">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => weakTopics.forEach(topic => toggleFilter('weakTopics', topic.topic))}
              className="text-xs h-7"
            >
              {selectedFilters.weakTopics.length === weakTopics.length ? 'Deselect All' : 'Select All Weak Topics'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Select only the weakest topics (accuracy < 40%)
                weakTopics
                  .filter(topic => topic.accuracy < 40)
                  .forEach(topic => toggleFilter('weakTopics', topic.topic))
              }}
              className="text-xs h-7"
            >
              Most Critical
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}