import { TestResults } from "@/components/exams/test/TestResults"

interface PageProps {
  params: {
    id: string
  }
}

export default function ResultsPage({ params }: PageProps) {
  return <TestResults examId={params.id} />
}