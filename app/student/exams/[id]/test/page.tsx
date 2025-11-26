import { TestInterface } from "@/components/exams/test/TestInterface"

interface PageProps {
  params: {
    id: string
  }
}

export default function TestPage({ params }: PageProps) {
  return <TestInterface examId={params.id} />
}