import { BookOpen, Plus, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface NoQuestionsEmptyStateProps {
  onImportQuestions?: () => void
  onAddCustom?: () => void
}

export function NoQuestionsEmptyState({ onImportQuestions, onAddCustom }: NoQuestionsEmptyStateProps) {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
      <CardContent className="p-8 lg:p-12">
        <div className="text-center max-w-md mx-auto">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg border border-purple-200">
                <BookOpen className="h-10 w-10 text-purple-600" />
              </div>
              <div className="absolute -bottom-2 -right-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white">
                  <Plus className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
            Question Bank Empty
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            There are no questions available in your question bank yet. Start by importing questions or creating custom ones.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3 justify-center mb-8">
            <Button 
              onClick={onImportQuestions}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg"
            >
              <Download className="h-4 w-4 mr-2" />
              Import Questions
            </Button>
            
            <Button 
              onClick={onAddCustom}
              variant="outline"
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Questions
            </Button>
          </div>

          {/* Quick Start Tips */}
          <div className="p-4 bg-white/50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-3 text-sm">🚀 Get Started:</h4>
            <ul className="text-xs text-purple-800 space-y-1.5 text-left">
              <li>• Import questions from previous BCS exams</li>
              <li>• Add custom questions for specific topics</li>
              <li>• Use our question templates for quick creation</li>
              <li>• Organize questions by subjects and difficulty</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}