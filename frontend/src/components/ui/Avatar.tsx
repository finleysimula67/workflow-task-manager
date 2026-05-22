import { cn } from '../../lib/utils'

interface AvatarProps {
  src?: string
  alt?: string
  initials?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

export default function Avatar({ src, alt, initials, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || ''}
        className={cn('rounded-full object-cover ring-2 ring-white/10', sizes[size], className)}
      />
    )
  }

  return (
    <div className={cn('rounded-full bg-white/10 flex items-center justify-center font-bold text-white', sizes[size], className)}>
      {initials || '?'}
    </div>
  )
}
