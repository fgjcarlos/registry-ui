import React, { useState } from 'react'
import Button from '../Button'

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function PasswordInput({ value = '', onChange, error, disabled = false }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      <div className={`input input-bordered flex items-center gap-2 ${error ? 'input-error' : ''} ${disabled ? 'input-disabled' : ''}`}>
        <svg className="h-4 w-4 opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2"
            fill="none"
            stroke="currentColor"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <circle cx="12" cy="16" r="1"></circle>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </g>
        </svg>
        <input
          type={showPassword ? "text" : "password"}
          className="grow"
          placeholder="Enter your password"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          minLength={8}
          title="Password must be at least 8 characters"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          shape="square"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          tabIndex={-1}
        >
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            {showPassword ? (
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </g>
            ) : (
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </g>
            )}
          </svg>
        </Button>
      </div>
      
      <div className="label">
        <span className="label-text-alt text-base-content/60 text-xs mt-0.5">
          Must be at least 8 characters long
        </span>
      </div>
      
      {error && (
        <div className="label">
          <span className="label-text-alt text-error">{error}</span>
        </div>
      )}
    </div>
  )
}
