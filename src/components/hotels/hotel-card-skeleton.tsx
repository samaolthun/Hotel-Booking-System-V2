import { Card, CardContent } from "@/src/components/ui/card"
import { Skeleton } from "@/src/components/ui/skeleton"

export function HotelCardSkeleton({ listView = false }: { listView?: boolean }) {
  if (listView) {
    return (
      <div className="bg-card rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        <div className="relative md:w-1/3">
          <Skeleton className="w-full h-60 md:h-full object-cover" />
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-4" />
          <div className="flex flex-wrap gap-2 mb-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="mt-auto flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <Skeleton className="w-full h-48 rounded-t-lg" />
        <div className="p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <div className="flex items-center mb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12 ml-2" />
          </div>
          <div className="flex flex-wrap gap-1 mb-3">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
