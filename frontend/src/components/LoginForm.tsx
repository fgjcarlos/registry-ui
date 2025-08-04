import React from 'react'
import { UsernameInput, PasswordInput, UrlRegistryInput } from './form'
import { FormData, FormErrors } from '../types'
import Button from './Button'

interface LoginFormProps {
  formData: FormData;
  errors: FormErrors;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onFieldChange: (field: keyof FormData) => (value: string) => void;
}

export default function LoginForm({ 
  formData, 
  errors, 
  isLoading, 
  onSubmit, 
  onFieldChange 
}: LoginFormProps) {
  return (
  
        <div className="w-full max-w-md">
          
          {/* Login Card */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body p-8">
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-base-content">Registry Login</h2>
                  <p className="text-sm text-base-content/60">Enter your credentials to continue</p>
                </div>
              </div>

              {errors.general && (
                <div className="alert alert-error mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.general}</span>
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="form-control">
                  <label className="label text-xs mb-0.5">
                    <span className="label-text font-medium">Registry URL</span>
                    <span className="label-text-alt text-primary">Required</span>
                  </label>
                  <UrlRegistryInput
                    value={formData.registryUrl}
                    onChange={onFieldChange('registryUrl')}
                    error={errors.registryUrl}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-control">
                  <label className="label text-xs mb-0.5">
                    <span className="label-text font-medium">Username</span>
                    <span className="label-text-alt text-primary">Required</span>
                  </label>
                  <UsernameInput
                    value={formData.username}
                    onChange={onFieldChange('username')}
                    error={errors.username}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-control">
                  <label className="label text-xs mb-0.5">
                    <span className="label-text font-medium">Password</span>
                    <span className="label-text-alt text-primary">Required</span>
                  </label>
                  <PasswordInput
                    value={formData.password}
                    onChange={onFieldChange('password')}
                    error={errors.password}
                    disabled={isLoading}
                  />
                </div>

                <div className="divider my-6"></div>

                <Button
                  type="submit"
                  variant="primary"
                  block={true}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                  </svg>
                  {isLoading ? 'Connecting...' : 'Connect to Registry'}
                </Button>
              </form>

              <div className="text-center mt-6">
                <p className="text-sm text-base-content/60">
                  Need help? Check the{' '}
                  <a href="#" className="link link-primary">documentation</a>
                </p>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-base-content/50">
              Powered by Docker Registry API
            </p>
          </div>

        </div>

  )
}
