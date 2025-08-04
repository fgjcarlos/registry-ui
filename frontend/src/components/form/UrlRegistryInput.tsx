import React from 'react'

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export default function UrlRegistryInput({ value = '', onChange, error, disabled = false }: Props) {
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
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M2 12h20"></path>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </g>
        </svg>
        <input
          type="url"
          className="grow"
          placeholder="https://registry.docker.io"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          pattern="https?://.+"
          title="Please enter a valid URL (http:// or https://)"
        />
        {value && (
          <div className="badge badge-sm badge-outline">
            {value.includes('docker.io') ? 'Docker Hub' : value.includes('localhost') ? 'Local' : 'Custom'}
          </div>
        )}
      </div>
      
      <div className="label">
        <span className="label-text-alt text-base-content/60 text-xs mt-0.5">
          Enter the Docker registry URL (e.g., https://registry.docker.io)
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