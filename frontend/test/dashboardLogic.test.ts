import { describe, it, expect, vi } from 'vitest';
import { initializeDashboardLogic, fetchImagesLogic } from '@/lib/dashboardLogic';
import { UserInfo, RegistryImage } from '@/types';

describe('dashboardLogic', () => {
  it('initializeDashboardLogic redirects when no user', async () => {
    const sessionService: { getCurrentUser: () => Promise<null> } = { getCurrentUser: vi.fn().mockResolvedValue(null) };
    const push = vi.fn();
    const setUser = vi.fn();

    const res = await initializeDashboardLogic(sessionService, push, setUser);

    expect(res).toBeNull();
    expect(push).toHaveBeenCalledWith('/');
    expect(setUser).not.toHaveBeenCalled();
  });

  it('initializeDashboardLogic sets user when present', async () => {
    const user: UserInfo = { username: 'foo', registryUrl: 'https://example.com' };
    const sessionService: { getCurrentUser: () => Promise<UserInfo> } = { getCurrentUser: vi.fn().mockResolvedValue(user) };
    const push = vi.fn();
    const setUser = vi.fn();

    const res = await initializeDashboardLogic(sessionService, push, setUser);

    expect(res).toEqual(user);
    expect(setUser).toHaveBeenCalledWith(user);
    expect(push).not.toHaveBeenCalled();
  });

  it('fetchImagesLogic sets images and page on first page', async () => {
  const mockImages: RegistryImage[] = [{ name: 'repo1', tags: ['v1'] }];
  const registryApi: { listImagesPaginated: (page: number, pageSize: number) => Promise<{ images: RegistryImage[]; nextPage?: number | null }> } = { listImagesPaginated: vi.fn().mockResolvedValue({ images: mockImages, nextPage: 2 }) };

    const setLoading = vi.fn();
    const setError = vi.fn();
    const setImages = vi.fn();
    const appendImages = vi.fn();
    const setPage = vi.fn();

    const parsed = await fetchImagesLogic(registryApi, 1, setLoading, setError, setImages, appendImages, setPage);

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setImages).toHaveBeenCalledWith(mockImages, mockImages.length);
    expect(setPage).toHaveBeenCalledWith(2);
    expect(parsed.images).toBe(mockImages);
  });

  it('fetchImagesLogic appends images on subsequent pages', async () => {
  const mockImages: RegistryImage[] = [{ name: 'repo2', tags: ['v2'] }];
  const registryApi: { listImagesPaginated: (page: number, pageSize: number) => Promise<{ images: RegistryImage[]; nextPage?: number | null }> } = { listImagesPaginated: vi.fn().mockResolvedValue({ images: mockImages, nextPage: null }) };

    const setLoading = vi.fn();
    const setError = vi.fn();
    const setImages = vi.fn();
    const appendImages = vi.fn();
    const setPage = vi.fn();

    const parsed = await fetchImagesLogic(registryApi, 2, setLoading, setError, setImages, appendImages, setPage);

    expect(appendImages).toHaveBeenCalledWith(mockImages);
    expect(setPage).not.toHaveBeenCalledWith(2);
    expect(parsed.images).toBe(mockImages);
  });
});
