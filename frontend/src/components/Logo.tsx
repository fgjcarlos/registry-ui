import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20'
  };

  return (
    <div className={`avatar placeholder ${className}`}>
      <div className={`bg-primary text-primary-content rounded-full ${sizeClasses[size]} p-2`}>
        <svg className="size-full" fill="currentColor" viewBox="0 0 24 24">
          {/* Registry/Container Stack */}
          <rect x="4" y="18" width="16" height="3" rx="1" opacity="0.9"/>
          <rect x="5" y="14" width="14" height="3" rx="1" opacity="0.7"/>
          <rect x="6" y="10" width="12" height="3" rx="1" opacity="0.5"/>
          
          {/* Docker-style logo elements */}
          <circle cx="12" cy="6" r="2" opacity="1"/>
          <rect x="10" y="3" width="4" height="1" rx="0.5"/>
          <rect x="9" y="7" width="2" height="1" rx="0.5"/>
          <rect x="13" y="7" width="2" height="1" rx="0.5"/>
          
          {/* Connection lines */}
          <line x1="12" y1="8" x2="12" y2="10" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
          <line x1="12" y1="13" x2="12" y2="14" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
          <line x1="12" y1="17" x2="12" y2="18" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
        </svg>
      </div>
    </div>
  )
}
