import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';

export function RepoLoadingSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Skeleton className="h-4 w-20" />
          <span>/</span>
          <Skeleton className="h-4 w-24" />
          <span>/</span>
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Skeleton className="h-10 w-64" />

          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        <Skeleton className="h-6 w-full max-w-2xl mt-3" />

        <div className="flex flex-wrap gap-4 mt-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-5 w-72" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-5/6 mb-3" />
              <Skeleton className="h-4 w-4/6 mb-6" />

              <div className="space-y-3 mt-4">
                <div className="flex">
                  <Skeleton className="h-5 w-5 mr-2" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="flex">
                  <Skeleton className="h-5 w-5 mr-2" />
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="flex">
                  <Skeleton className="h-5 w-5 mr-2" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-32" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-32" />
                </div>

                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-40" />
                </div>

                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-20" />
                </div>

                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 w-8" />
                </div>

                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <div className="mt-1 flex flex-wrap gap-2">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-6 w-16 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return <RepoLoadingSkeleton />;
}
