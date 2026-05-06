import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  className = '', 
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-primary text-[#FDFCF9] hover:bg-primary-hover shadow-sm hover:shadow-md hover:shadow-primary/20',
    secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-2 hover:border-border-strong',
    ghost: 'text-text-muted hover:bg-surface-2 hover:text-text-primary',
    link: 'text-primary hover:text-primary-hover underline-offset-4 hover:underline !p-0 !h-auto',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-10 px-5 py-2 text-sm',
    lg: 'h-12 px-8 text-base',
    icon: 'h-10 w-10',
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;