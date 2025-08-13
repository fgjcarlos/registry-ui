'use client';

import React from 'react';
import { LoginForm } from "../components";
import { useLoginForm } from "../hooks/useLoginForm";
import HomeHeader from "./HomeHeader";

const HomeView: React.FC = () => {
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
        <HomeHeader />
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
};

export default HomeView;
