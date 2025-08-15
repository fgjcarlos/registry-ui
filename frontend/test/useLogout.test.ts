import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock next/router
const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock })
}));

// Create store mocks (function + getState)
const logoutMock = vi.fn(async () => {});
const setLoadingMock = vi.fn();
const clearMock = vi.fn();

vi.mock('@/store/useAppStore', () => {
  type PartialStore = { logout: () => Promise<void> };

  const useAppStore = (selector?: (s: PartialStore) => unknown) => {
    if (typeof selector === 'function') return selector({ logout: logoutMock });
    return { logout: logoutMock } as PartialStore;
  };
  // attach getState to emulate zustand's getState
  (useAppStore as unknown as { getState: () => { setLoading: typeof setLoadingMock; clear: typeof clearMock } }).getState = () => ({ setLoading: setLoadingMock, clear: clearMock });
  return { useAppStore };
});

import { useLogout } from '@/hooks/useLogout';

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens dialog and performs logout, clears store and navigates', async () => {
    const { result } = renderHook(() => useLogout());

    // open dialog
    act(() => result.current.open());
    expect(result.current.dialogOpen).toBe(true);

    // perform logout
    await act(async () => {
      await result.current.handleLogout();
    });

    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(setLoadingMock).toHaveBeenCalledWith(false);
    expect(clearMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith('/');
    expect(result.current.dialogOpen).toBe(false);
  });
});
