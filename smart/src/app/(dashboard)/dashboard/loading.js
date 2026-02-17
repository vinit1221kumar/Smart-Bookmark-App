import Container from '@/components/layout/Container';
import { BookmarkCardSkeleton } from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <Container>
      <div className="space-y-8">
        {/* Form Skeleton */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-10 bg-blue-200 dark:bg-blue-900 rounded animate-pulse" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <BookmarkCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </Container>
  );
}
