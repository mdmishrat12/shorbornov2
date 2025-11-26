import { QuestionSkeleton } from "./QuestionSkeleton"

interface SkeletonGridProps {
  count?: number
  type?: 'question' | 'card' | 'list'
}

export function SkeletonGrid({ count = 6, type = 'question' }: SkeletonGridProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <QuestionSkeleton key={index} />
      ))}
    </div>
  )
}