import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PatientListSkeleton() {
  return (
    <ul className="grid gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items don't change order
        <li key={i}>
          <Card size="sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export function PatientDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-7 w-16 animate-pulse rounded bg-muted" />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="size-10 animate-pulse rounded-full bg-muted" />
            <div className="space-y-1.5">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items don't change order
              <div key={i} className="flex items-start gap-2">
                <div className="mt-0.5 size-3.5 animate-pulse rounded bg-muted" />
                <div className="space-y-1">
                  <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-16 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function EditPatientSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-7 w-16" />
      <Card>
        <CardHeader>
          <CardTitle>Edit Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 5 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton items don't change order
                <div key={`skeleton-${i}`} className="space-y-1.5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
              <div className="space-y-1.5 sm:col-span-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
