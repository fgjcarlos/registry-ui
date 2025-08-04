import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormData, FormErrors } from '../types';
import { RegistryService } from '../services/registryService';
import { SessionService } from '../services/sessionService';

export function useLoginForm() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    registryUrl: 'http://localhost:5000'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[A-Za-z][A-Za-z0-9\-]*$/.test(formData.username)) {
      newErrors.username = 'Username must start with a letter and contain only letters, numbers, or dashes';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Registry URL validation
    if (!formData.registryUrl.trim()) {
      newErrors.registryUrl = 'Registry URL is required';
    } else if (!RegistryService.validateRegistryUrl(formData.registryUrl)) {
      newErrors.registryUrl = 'Please enter a valid URL (http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await SessionService.saveSession(
        formData.username,
        formData.password,
        formData.registryUrl
      );

      if (result.success) {
        // Navigate to dashboard
        router.push('/dashboard');
        
        console.log('Login successful!', result.user);
      } else {
        setErrors({ general: result.error || 'Login failed' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const resetForm = async () => {
    await SessionService.clearSession();
    setErrors({});
  };

  return {
    formData,
    errors,
    isLoading,
    handleSubmit,
    updateFormData,
    resetForm
  };
}
