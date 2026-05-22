import { cn } from '../../lib/utils'

type BadgeVariant = 'default' | 'primary' | 'amber' | 'emerald' | 'red' | 'orange' | 'slate' | 'sky'

interface BadgeProps {
  variant?: BadgeVariant
  className?: string
  children: React.ReactNode
  size?: 'sm' | 'md'
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-white/5 text-slate-400 border-white/[0.06]',
  primary: 'bg-primary-500/10 text-primary-400 border-primary-500/30',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  red: 'bg-red-500/10 text-red-400 border-red-500/30',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  slate: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  sky: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
}

const sizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
}

export function Badge({ variant = 'default', className, children, size = 'md' }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center font-semibold uppercase tracking-wider border rounded-full', variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    TODO: 'primary',
    IN_PROGRESS: 'amber',
    COMPLETED: 'emerald',
    ARCHIVED: 'slate',
  }
  return <Badge variant={map[status] || 'default'}>{status.replace('_', ' ')}</Badge>
}

export function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, BadgeVariant> = {
    URGENT: 'red',
    HIGH: 'orange',
    MEDIUM: 'amber',
    LOW: 'emerald',
  }
  return <Badge variant={map[priority] || 'default'}>{priority}</Badge>
}
