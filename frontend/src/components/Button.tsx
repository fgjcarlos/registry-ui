import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'error' | 'warning' | 'info' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  shape?: 'square' | 'circle';
  block?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary',
  size = 'md',
  shape,
  block = false,
  loading = false,
  className = '',
  disabled,
  children,
  ...props 
}: ButtonProps) {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    outline: 'btn-outline',
    error: 'btn-error',
    warning: 'btn-warning',
    info: 'btn-info',
    success: 'btn-success'
  };

  const sizeClasses = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  const shapeClasses = {
    square: 'btn-square',
    circle: 'btn-circle'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    shape && shapeClasses[shape],
    block && 'btn-block',
    loading && 'loading',
    className,
    'rounded-lg'
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="loading loading-spinner loading-sm"></span>}
      {children}
    </button>
  );
}
