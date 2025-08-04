'use client';

import { LoginForm, Logo } from "../components";
import { useLoginForm } from "../hooks/useLoginForm";

export default function Home() {
  const {
    formData,
    errors,
    isLoading,
    handleSubmit,
    updateFormData
  } = useLoginForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">

        {/* Header */}
        <div className="text-center mb-8">
          <Logo className="mb-4" />
          <h1 className="text-3xl font-bold text-base-content mb-2">
            Welcome to <span className="text-primary">Registry UI</span>
          </h1>
          <p className="text-base-content/70">Connect to your Docker registry</p>
        </div>
        <LoginForm
          formData={formData}
          errors={errors}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onFieldChange={updateFormData}
        />
      </div>
    </div>
  );
}
