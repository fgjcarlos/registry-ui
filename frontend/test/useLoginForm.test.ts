import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type React from 'react';
import { useLoginForm } from '@/hooks/useLoginForm';

// Mock router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() })
}));

// Mock RegistryService.validateRegistryUrl to accept urls
vi.mock('@/services/registryService', () => ({
  RegistryService: { validateRegistryUrl: () => true }
}));

// Mock SessionService.clearSession (used in resetForm)
vi.mock('@/services/sessionService', () => ({
  SessionService: { clearSession: vi.fn() }
}));

// Mock the store login to simulate success/failure
vi.mock('@/store/useAppStore', () => ({
  useAppStore: {
    getState: () => ({
      login: vi.fn(async (username: string) => ({ success: true, user: { username } })),
      clear: vi.fn()
    })
  }
}));

describe('useLoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits valid form and navigates on success', async () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.updateFormData('username')('alice');
      result.current.updateFormData('password')('password123');
      result.current.updateFormData('registryUrl')('https://reg');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} } as unknown as React.FormEvent<HTMLFormElement>);
    });

    // After successful login, errors should be empty
    expect(result.current.errors.general).toBeUndefined();
  });

  it('shows validation errors for invalid form', async () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.updateFormData('username')('');
      result.current.updateFormData('password')('');
      result.current.updateFormData('registryUrl')('');
    });

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errors.username).toBeDefined();
    expect(result.current.errors.password).toBeDefined();
    expect(result.current.errors.registryUrl).toBeDefined();
  });
});
