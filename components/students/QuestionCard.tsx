// components/student/QuestionCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface QuestionCardProps {
  question: {
    id: number
    questionText: string
    questionTextBn?: string
    options: Array<{ id: number; optionText: string }>
  }
  selectedOption: number | null
  onOptionSelect: (optionId: number) => void
}

export function QuestionCard({ question, selectedOption, onOptionSelect }: QuestionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {question.questionText}
        </CardTitle>
        {question.questionTextBn && (
          <p className="text-sm text-muted-foreground font-bangla">
            {question.questionTextBn}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption?.toString()} onValueChange={(value:any) => onOptionSelect(parseInt(value))}>
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
              <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                {option.optionText}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}