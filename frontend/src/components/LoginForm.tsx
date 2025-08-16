import React from 'react'
import { UsernameInput, PasswordInput, UrlRegistryInput } from './form'
import { FormData, FormErrors } from '../types'
import Button from './Button'
import LoginHeader from "./LoginHeader";
import LabelText from "./LabelText";
import FormControl from "./FormControl";
import Divider from "./Divider";
import SubmitButtonIcon from "./SubmitButtonIcon";
import Footer from "./Footer";
import HelpSection from "./HelpSection";
import { useTranslations } from 'next-intl';

interface LoginFormProps {
  formData: FormData;
  errors: FormErrors;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onFieldChange: (field: keyof FormData) => (value: string) => void;
}

function LoginForm({ 
  formData, 
  errors, 
  isLoading, 
  onSubmit, 
  onFieldChange 
}: LoginFormProps) {
  const t = useTranslations('feature');
  return (
  
        <div className="w-full max-w-md">
          
          {/* Login Card */}
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body p-8">
              
              {/* Login Header */}
              <LoginHeader />

              {errors.general && (
                <div className="alert alert-error mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.general}</span>
                </div>
              )}

              <form onSubmit={onSubmit} className="space-y-6">
                <FormControl>
                  <LabelText label={t('login.registryUrl')} required={true} />
                  <UrlRegistryInput
                    value={formData.registryUrl}
                    onChange={onFieldChange('registryUrl')}
                    error={errors.registryUrl}
                    disabled={isLoading}
                  />
                </FormControl>

                <FormControl>
                  <LabelText label={t('login.username')} required={true} />
                  <UsernameInput
                    value={formData.username}
                    onChange={onFieldChange('username')}
                    error={errors.username}
                    disabled={isLoading}
                  />
                </FormControl>

                <FormControl>
                  <LabelText label={t('login.password')} required={true} />
                  <PasswordInput
                    value={formData.password}
                    onChange={onFieldChange('password')}
                    error={errors.password}
                    disabled={isLoading}
                  />
                </FormControl>

                <Divider />

                <Button
                  type="submit"
                  variant="primary"
                  block={true}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  <SubmitButtonIcon />
                  {isLoading ? t('login.connecting') : t('login.connect')}
                </Button>
              </form>

              <HelpSection />

            </div>
          </div>

          {/* Footer */}
          <Footer />

        </div>

  )
}

export default React.memo(LoginForm);
