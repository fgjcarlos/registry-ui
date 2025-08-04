import React from 'react'

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function UsernameInput({ value = '', onChange, error, disabled = false }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
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
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </g>
        </svg>
        <input
          type="text"
          className="grow"
          placeholder="Enter your username"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          pattern="[A-Za-z][A-Za-z0-9\-]*"
          minLength={3}
          maxLength={30}
          title="Only letters, numbers or dash"
        />
      </div>
      
      <div className="label">
        <span className="label-text-alt text-base-content/60 text-xs mt-0.5">
          Must be 3-30 characters (letters, numbers, or dash)
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