"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, ChevronDown, ChevronUp } from "lucide-react"
import { usePractice } from "@/hooks/usePractice"
import { cn } from "@/lib/utils"

// Mock topics data - Replace with actual data from your API
const allTopics = [
  // Bangla
  "Bangla Grammar", "Bangla Literature", "Bangla Poetry", "Bangla Novel", "Bangla Drama",
  "Bangla Language History", "Bangla Vocabulary", "Bangla Composition",
  
  // English
  "English Grammar", "English Literature", "Vocabulary", "Comprehension", "Prepositions",
  "Tenses", "Articles", "Sentence Structure", "Synonyms & Antonyms",
  
  // Mathematics
  "Algebra", "Geometry", "Arithmetic", "Trigonometry", "Calculus", "Statistics",
  "Probability", "Number Theory", "Word Problems",
  
  // General Knowledge
  "Bangladesh History", "World History", "Geography", "Economics", "Politics",
  "Science & Technology", "Sports", "International Organizations", "Awards & Honors",
  
  // Science
  "Physics", "Chemistry", "Biology", "Computer Science", "Environmental Science",
  "Astronomy", "Scientific Discoveries",
  
  // Bangladesh Affairs
  "Liberation War", "Constitution", "Five Year Plans", "Government Policies",
  "Cultural Heritage", "Rivers & Geography", "Economy", "Education System"
]

export function TopicFilter() {
  const { selectedFilters, toggleFilter } = usePractice()
  const [searchQuery, setSearchQuery] = useState("")
  const [showAll, setShowAll] = useState(false)

  // Filter topics based on search and selected subjects
  const filteredTopics = allTopics.filter(topic => {
    const matchesSearch = topic.toLowerCase().includes(searchQuery.toLowerCase())
    
    // If subjects are selected, only show topics that match those subjects
    if (selectedFilters.subjects.length > 0) {
      const subjectMatches = selectedFilters.subjects.some(subject => 
        topic.toLowerCase().includes(subject.toLowerCase())
      )
      return matchesSearch && subjectMatches
    }
    
    return matchesSearch
  })

  // Show limited topics initially, all when expanded
  const displayTopics = showAll ? filteredTopics : filteredTopics.slice(0, 8)

  const clearSearch = () => setSearchQuery("")

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-gray-900">Topics</h3>
        {selectedFilters.topics.length > 0 && (
          <span className="text-xs text-blue-600 font-medium">
            {selectedFilters.topics.length} selected
          </span>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-8 text-sm"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Topics List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {displayTopics.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            No topics found
          </div>
        ) : (
          <>
            {displayTopics.map((topic) => (
              <div key={topic} className="flex items-center space-x-2">
                <Checkbox
                  id={`topic-${topic}`}
                  checked={selectedFilters.topics.includes(topic)}
                  onCheckedChange={() => toggleFilter('topics', topic)}
                />
                <Label
                  htmlFor={`topic-${topic}`}
                  className="text-sm font-normal cursor-pointer flex-1 truncate"
                >
                  {topic}
                </Label>
              </div>
            ))}
          </>
        )}

        {/* Show More/Less Toggle */}
        {filteredTopics.length > 8 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="w-full text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show More ({filteredTopics.length - 8} more)
              </>
            )}
          </Button>
        )}
      </div>

      {/* Selected Topics Pills */}
      {selectedFilters.topics.length > 0 && (
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Selected:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectedFilters.topics.forEach(topic => toggleFilter('topics', topic))}
              className="h-6 text-xs text-red-600 hover:text-red-700"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedFilters.topics.slice(0, 3).map((topic) => (
              <div
                key={topic}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
              >
                <span className="truncate max-w-20">{topic}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFilter('topics', topic)}
                  className="h-3 w-3 min-w-3 hover:bg-blue-200"
                >
                  <X className="h-2 w-2" />
                </Button>
              </div>
            ))}
            {selectedFilters.topics.length > 3 && (
              <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                +{selectedFilters.topics.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}