'use client';

const Skeleton = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
  variant = 'default',
  ...props
}) => {
  const variants = {
    default:
      'bg-gray-200 dark:bg-gray-700 animate-pulse rounded',
    card: 'bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg',
    circle: 'bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full',
  };

  const variantClass = variants[variant] || variants.default;

  return (
    <div
      className={`${variantClass} ${width} ${height} ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton variant="card" height="h-32" />
    <Skeleton variant="card" height="h-4" width="w-3/4" />
    <Skeleton variant="card" height="h-3" width="w-1/2" />
  </div>
);

export const BookmarkCardSkeleton = () => (
  <div className="p-4 space-y-3 border border-gray-200 dark:border-gray-800 rounded-lg">
    <Skeleton height="h-5" width="w-2/3" />
    <Skeleton height="h-4" width="w-full" />
    <div className="flex gap-2 pt-2">
      <Skeleton height="h-8" width="w-1/4" />
      <Skeleton height="h-8" width="w-1/4" />
    </div>
  </div>
);

export default Skeleton;
