import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '@/store/useAppStore';
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboard } from '@/hooks/useDashboard';

// Mock services
vi.mock('@/services/sessionService', () => ({
  SessionService: { getCurrentUser: vi.fn(async () => ({ username: 'alice', registryUrl: 'https://reg' })) }
}));

vi.mock('@/services/registryApiService', () => ({
  listImagesPaginated: vi.fn(async (page: number) => {
    if (page === 1) return { images: [{ name: 'img1', tags: ['v1'] }], nextPage: 2 };
    return { images: [{ name: `img${page}`, tags: ['v1'] }], nextPage: null };
  })
}));

// Mock Next router (useRouter is used inside the hook)
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() })
}));

// Reset store between tests
beforeEach(() => {
  useAppStore.getState().clear();
  vi.clearAllMocks();
});

describe('useDashboard', () => {
  it('replaces images when page === 1', async () => {
  renderHook(() => useDashboard());

  // wait for the store to be updated by the hook
  await waitFor(() => expect(useAppStore.getState().registryImages.length).toBe(1));
  expect(useAppStore.getState().registryImages[0].name).toBe('img1');
  });

  it('appends images when fetching subsequent pages', async () => {
    // set page to 2 to simulate pagination
    useAppStore.getState().setPage(2);
  renderHook(() => useDashboard());

  await waitFor(() => expect(useAppStore.getState().registryImages.length).toBe(1));
  expect(useAppStore.getState().registryImages[0].name).toBe('img2');
  });
});
