import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-accent-primary text-gaming-dark-950 hover:bg-accent-primary/90 focus:ring-accent-primary/50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    secondary: 'bg-accent-secondary text-white hover:bg-accent-secondary/90 focus:ring-accent-secondary/50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    outline: 'border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-gaming-dark-950 focus:ring-accent-primary/50',
    ghost: 'text-text-primary hover:bg-bg-tertiary focus:ring-accent-primary/50',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
