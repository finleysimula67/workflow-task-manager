import { type TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <textarea
        id={id}
        ref={ref}
        className={cn(
          'w-full px-4 py-2.5 rounded-xl bg-white/5 border text-white placeholder-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20',
          'transition-all duration-200 resize-none',
          error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  ),
)

Textarea.displayName = 'Textarea'
export default Textarea
