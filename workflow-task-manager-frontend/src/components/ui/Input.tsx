import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white placeholder-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20',
          'transition-all duration-200',
          error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  ),
)

Input.displayName = 'Input'
export default Input
