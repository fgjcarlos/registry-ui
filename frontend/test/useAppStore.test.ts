import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStore } from '@/store/useAppStore';

// Mock the SessionService used by the store
vi.mock('@/services/sessionService', () => {
  return {
    SessionService: {
      saveSession: vi.fn(async (username: string) => {
        return { success: true, user: { username, registryUrl: 'https://reg' } };
      }),
      clearSession: vi.fn(async () => ({ success: true })),
    },
  };
});

describe('useAppStore', () => {
  beforeEach(() => {
    // reset store to initial state
    useAppStore.getState().clear();
    vi.clearAllMocks();
  });

  it('setUser and clear work', () => {
    useAppStore.getState().setUser({ username: 'alice', registryUrl: 'https://reg' });
    expect(useAppStore.getState().user?.username).toBe('alice');

    useAppStore.getState().clear();
    expect(useAppStore.getState().user).toBeNull();
  });

  it('setImages and appendImages update state', () => {
    useAppStore.getState().setImages([{ name: 'img1', tags: ['v1'], lastModified: '', size: '0' }], 1);
    expect(useAppStore.getState().registryImages.length).toBe(1);
    expect(useAppStore.getState().totalImages).toBe(1);

    useAppStore.getState().appendImages([{ name: 'img2', tags: ['v1'], lastModified: '', size: '0' }]);
    expect(useAppStore.getState().registryImages.length).toBe(2);
    expect(useAppStore.getState().totalImages).toBe(2);
  });

  it('login sets user via SessionService.saveSession', async () => {
    const res = await useAppStore.getState().login('bob', 'pass', 'https://reg');
    expect(res.success).toBe(true);
    expect(useAppStore.getState().user?.username).toBe('bob');
  });

  it('logout clears user and images', async () => {
    // set some state first
    useAppStore.getState().setUser({ username: 'bob', registryUrl: 'https://reg' });
    useAppStore.getState().setImages([{ name: 'img1', tags: ['v1'], lastModified: '', size: '0' }], 1);

    await useAppStore.getState().logout();
    expect(useAppStore.getState().user).toBeNull();
    expect(useAppStore.getState().registryImages.length).toBe(0);
  });
});
