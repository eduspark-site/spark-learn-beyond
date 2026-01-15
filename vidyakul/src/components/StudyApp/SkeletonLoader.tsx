interface SkeletonLoaderProps {
  count?: number;
  type?: 'card' | 'lecture';
}

const SkeletonLoader = ({ count = 6, type = 'card' }: SkeletonLoaderProps) => {
  if (type === 'lecture') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="skeleton h-20 flex items-center gap-4 p-4"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="w-10 h-10 rounded-xl bg-muted/50" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-muted/50 rounded" />
              <div className="h-3 w-1/2 bg-muted/50 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-32"
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
