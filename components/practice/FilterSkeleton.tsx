import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function FilterSkeleton() {
  return (
    <Card className="border-0 shadow-lg animate-pulse">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-8 w-16 rounded" />
        </div>
        <Skeleton className="h-4 w-32 rounded mt-2" />
      </CardHeader>

      <CardContent className="p-4 space-y-6">
        {/* Quick Filters Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-32 rounded" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </div>

        {/* Subject Filter Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-24 rounded" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Topic Filter Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-20 rounded" />
          <div className="space-y-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}