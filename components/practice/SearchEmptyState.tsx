import { Search, BookOpen, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface SearchEmptyStateProps {
  searchQuery: string
  onClearSearch: () => void
  onBrowseAll: () => void
}

export function SearchEmptyState({ searchQuery, onClearSearch, onBrowseAll }: SearchEmptyStateProps) {
  const suggestions = [
    "Try different keywords",
    "Check for spelling mistakes", 
    "Search by subject name",
    "Use broader search terms",
    "Browse by topics instead"
  ]

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
      <CardContent className="p-8 lg:p-12">
        <div className="text-center max-w-md mx-auto">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg border border-orange-200">
                <Search className="h-10 w-10 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
            No results for "{searchQuery}"
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We couldn't find any questions matching your search. Try adjusting your search terms or browse all questions.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Button 
              onClick={onClearSearch}
              variant="outline"
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Search
            </Button>
            
            <Button 
              onClick={onBrowseAll}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Browse All Questions
            </Button>
          </div>

          {/* Search Suggestions */}
          <div className="p-4 bg-white/50 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-900 mb-3 text-sm">💡 Search Tips:</h4>
            <ul className="text-xs text-orange-800 space-y-1.5 text-left">
              {suggestions.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}