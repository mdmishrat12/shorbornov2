// components/admin/QuestionsTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export function QuestionsTable({ questions }: { questions: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Question</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>BCS Year</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {questions.map((question) => (
          <TableRow key={question.id}>
            <TableCell className="font-medium max-w-md truncate">
              {question.questionText}
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{question.topic.subject.name}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={question.difficulty === 'HARD' ? 'destructive' : 'default'}>
                {question.difficulty}
              </Badge>
            </TableCell>
            <TableCell>{question.bcsYear || '-'}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}