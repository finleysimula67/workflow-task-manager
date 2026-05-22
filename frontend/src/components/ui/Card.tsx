import { cn } from '../../lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({ className, children, hover = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-black/40 border border-white/[0.06] backdrop-blur-xl',
        paddings[padding],
        hover && 'hover:border-white/[0.12] hover:bg-black/50 transition-all duration-300',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('flex items-center justify-between mb-4', className)}>{children}</div>
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={cn('font-semibold text-white', className)}>{children}</h3>
}

export function CardDescription({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={cn('text-sm text-slate-400', className)}>{children}</p>
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn(className)}>{children}</div>
}

export function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.06]', className)}>{children}</div>
}
