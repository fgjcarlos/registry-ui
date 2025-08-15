'use client';

import React from 'react';
import { useLoginForm } from "../hooks/useLoginForm";
import HomeHeader from "./HomeHeader";
import LoginForm from './LoginForm';
import BackgroundWrapper from './BackgroundWrapper';
import CenteredContainer from './CenteredContainer';

const HomeView: React.FC = () => {
  const {
    formData,
    errors,
    isLoading,
    handleSubmit,
    updateFormData
  } = useLoginForm();

  return (
    <BackgroundWrapper>
      <CenteredContainer>
        <HomeHeader />
        <LoginForm
          formData={formData}
          errors={errors}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onFieldChange={updateFormData}
        />
      </CenteredContainer>
    </BackgroundWrapper>
  );
};

export default HomeView;
