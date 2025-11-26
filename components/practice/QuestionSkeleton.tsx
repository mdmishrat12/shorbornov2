import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function QuestionSkeleton() {
  return (
    <Card className="border-2 border-gray-100 animate-pulse">
      <CardContent className="p-6">
        {/* Header Skeleton */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Badges Skeleton */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Question Text Skeleton */}
            <div className="space-y-2 mb-4">
              <Skeleton className="h-5 w-full rounded" />
              <Skeleton className="h-5 w-4/5 rounded" />
              <Skeleton className="h-5 w-3/4 rounded" />
            </div>

            {/* Bangla Text Skeleton (sometimes) */}
            <Skeleton className="h-4 w-2/3 rounded mb-4" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex items-center gap-1 ml-4">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>

        {/* Options Skeleton */}
        <div className="grid gap-3 mb-6">
          {[1, 2, 3, 4].map((option) => (
            <div key={option} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 flex-1 rounded" />
            </div>
          ))}
        </div>

        {/* Stats and Actions Skeleton */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Stats Skeleton */}
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((stat) => (
              <div key={stat} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
            ))}
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-28 rounded" />
            <Skeleton className="h-9 w-32 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}