import { Skeleton } from "@/components/ui/skeleton";

export function AppointmentsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-36" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(280px,auto)_1fr]">
        {/* Calendar skeleton */}
        <Skeleton className="h-72 w-full" />

        {/* Day appointments skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 3 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
