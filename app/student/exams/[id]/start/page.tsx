import { TestStartClient } from "@/components/exams/test/TestStartClient"

interface PageProps {
  params: {
    id: string
  }
}

export default function TestStartPage({ params }: PageProps) {
  return <TestStartClient examId={params.id} />
}