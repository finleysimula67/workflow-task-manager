export default function LoadingSkeleton({ type = 'card', count = 3 }: { type?: 'card' | 'list' | 'profile' | 'table'; count?: number }) {
  const baseClass = 'animate-pulse bg-white/5 rounded';

  const CardSkeleton = () => (
    <div className="bg-black border border-white/[0.08] p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className={`h-5 ${baseClass} w-3/4`} />
          <div className={`h-4 ${baseClass} w-1/2`} />
        </div>
        <div className={`h-6 w-6 rounded-full ${baseClass}`} />
      </div>
      <div className="flex items-center gap-2">
        <div className={`h-4 w-4 rounded ${baseClass}`} />
        <div className={`h-4 ${baseClass} w-24`} />
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-white/[0.06]">
        <div className={`h-6 w-16 rounded-full ${baseClass}`} />
        <div className={`h-6 w-20 rounded-full ${baseClass}`} />
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="flex items-center gap-4 p-4 bg-black border border-white/[0.08]">
      <div className={`h-10 w-10 rounded-lg ${baseClass}`} />
      <div className="flex-1 space-y-2">
        <div className={`h-4 ${baseClass} w-2/3`} />
        <div className={`h-3 ${baseClass} w-1/3`} />
      </div>
      <div className={`h-8 w-8 rounded-lg ${baseClass}`} />
    </div>
  );

  const ProfileSkeleton = () => (
    <div className="bg-black border border-white/[0.08] p-6">
      <div className="flex items-center gap-4">
        <div className={`h-20 w-20 rounded-full ${baseClass}`} />
        <div className="flex-1 space-y-2">
          <div className={`h-5 ${baseClass} w-32`} />
          <div className={`h-4 ${baseClass} w-48`} />
        </div>
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <div className="bg-black border border-white/[0.08] overflow-hidden">
      <div className="p-4 border-b border-white/[0.06]">
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-4 ${baseClass} w-20`} />
          ))}
        </div>
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 border-b border-white/[0.06] last:border-0">
          <div className="flex gap-4">
            <div className={`h-4 ${baseClass} w-1/4`} />
            <div className={`h-4 ${baseClass} w-1/3`} />
            <div className={`h-4 ${baseClass} w-20`} />
            <div className={`h-6 w-16 rounded-full ${baseClass}`} />
          </div>
        </div>
      ))}
    </div>
  );

  const skeletons = { card: CardSkeleton, list: ListSkeleton, profile: ProfileSkeleton, table: TableSkeleton };
  const SkeletonComponent = skeletons[type];

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
}
