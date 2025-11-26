import { Button } from "@/components/ui/button"
import { BookOpen, Play, Calendar } from "lucide-react"

export function ExamHeader() {
  return (
    <div className="text-center lg:text-left">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Exam Center
          </h1>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl">
            Practice with realistic BCS exam simulations and track your progress
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Play className="h-4 w-4 mr-2" />
            Start Test
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        </div>
      </div>
    </div>
  )
}