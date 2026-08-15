import { cn } from '../../lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export default function Skeleton({ className, variant = 'text', width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-white/5 rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-xl',
        className,
      )}
      style={{ width, height }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-black border border-white/[0.08] rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton variant="circular" className="h-10 w-10" />
      </div>
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-black border border-white/[0.08] rounded-xl">
          <Skeleton variant="circular" className="h-10 w-10 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-black border border-white/[0.08] rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white/[0.06]">
        <div className="flex gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-white/[0.06] last:border-0">
          <div className="flex gap-6">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
