import { forwardRef } from 'react';

const Input = forwardRef(({ className = '', label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      {/* ── Label ── */}
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      
      {/* ── Input Field ── */}
      <input
        className={`flex h-11 w-full rounded-lg border bg-surface px-4 py-2 text-sm text-text-primary placeholder:text-text-muted/50 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:bg-background ${
          error 
            ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-500/10' 
            : 'border-border hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/10'
        } ${className}`}
        ref={ref}
        {...props}
      />
      
      {/* ── Error Message ── */}
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600 tracking-wide">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;