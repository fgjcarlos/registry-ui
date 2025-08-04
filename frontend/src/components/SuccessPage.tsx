import React from 'react'
import Button from './Button'

interface SuccessPageProps {
  registryUrl: string;
  username: string;
  onBackToLogin: () => void;
  onViewRegistry?: () => void;
}

export default function SuccessPage({ 
  registryUrl, 
  username, 
  onBackToLogin, 
  onViewRegistry 
}: SuccessPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-success/10 to-success/5 flex items-center justify-center p-8">
      <div className="card bg-base-100 shadow-2xl max-w-md w-full">
        <div className="card-body text-center p-8">
          
          <div className="avatar placeholder mb-6">
            <div className="bg-success text-success-content rounded-full w-20">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-success mb-4">
            Connection Successful!
          </h1>
          
          <p className="text-base-content/70 mb-6">
            You have successfully connected to the Docker registry. 
            You can now manage your containers and images.
          </p>

          <div className="stats shadow bg-base-200 mb-6">
            <div className="stat place-items-center">
              <div className="stat-title">Registry URL</div>
              <div className="stat-value text-sm text-primary truncate" title={registryUrl}>
                {registryUrl}
              </div>
              <div className="stat-desc">Connected as {username}</div>
            </div>
          </div>

          <div className="card-actions justify-center gap-4">
            <Button 
              variant="primary"
              onClick={onBackToLogin}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Back to Login
            </Button>
            <Button 
              variant="outline"
              onClick={onViewRegistry}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              View Registry
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
