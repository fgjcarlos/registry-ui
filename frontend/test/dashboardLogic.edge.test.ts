import { describe, it, expect, vi } from 'vitest';
import { fetchImagesLogic, initializeDashboardLogic } from '@/lib/dashboardLogic';
import { RegistryImage, UserInfo } from '@/types';

describe('dashboardLogic - edge cases', () => {
  it('fetchImagesLogic propagates API errors and sets error/loading', async () => {
  const registryApi: { listImagesPaginated: (page: number, pageSize: number) => Promise<{ images: RegistryImage[]; nextPage?: number | null }> } = { listImagesPaginated: vi.fn().mockRejectedValue(new Error('Network fail')) };

    const setLoading = vi.fn();
    const setError = vi.fn();
    const setImages = vi.fn();
    const appendImages = vi.fn();
    const setPage = vi.fn();

    await expect(
      fetchImagesLogic(registryApi, 1, setLoading, setError, setImages, appendImages, setPage)
    ).rejects.toThrow('Network fail');

    // setLoading should be called with true then finally false
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
    expect(setError).toHaveBeenCalled();
  });

  it('fetchImagesLogic handles invalid response shape by setting error', async () => {
  const registryApi: { listImagesPaginated: (page: number, pageSize: number) => Promise<{ images: RegistryImage[]; nextPage?: number | null }> } = { listImagesPaginated: vi.fn().mockResolvedValue({}) };

    const setLoading = vi.fn();
    const setError = vi.fn();
    const setImages = vi.fn();
    const appendImages = vi.fn();
    const setPage = vi.fn();

    await expect(
      fetchImagesLogic(registryApi, 1, setLoading, setError, setImages, appendImages, setPage)
    ).rejects.toBeTruthy();

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
    expect(setError).toHaveBeenCalled();
  });

  it('fetchImagesLogic accepts empty images array and sets total 0', async () => {
    const mockImages: RegistryImage[] = [];
  const registryApi: { listImagesPaginated: (page: number, pageSize: number) => Promise<{ images: RegistryImage[]; nextPage?: number | null }> } = { listImagesPaginated: vi.fn().mockResolvedValue({ images: mockImages, nextPage: null }) };

    const setLoading = vi.fn();
    const setError = vi.fn();
    const setImages = vi.fn();
    const appendImages = vi.fn();
    const setPage = vi.fn();

  const parsed = await fetchImagesLogic(registryApi, 1, setLoading, setError, setImages, appendImages, setPage);

    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
    expect(setImages).toHaveBeenCalledWith(mockImages, 0);
    expect(appendImages).not.toHaveBeenCalled();
    expect(setPage).not.toHaveBeenCalled();
    expect(parsed.images).toBe(mockImages);
  });

  it('initializeDashboardLogic re-throws when sessionService throws', async () => {
  const sessionService: { getCurrentUser: () => Promise<UserInfo | null> } = { getCurrentUser: vi.fn().mockRejectedValue(new Error('boom')) };
    const push = vi.fn();
    const setUser = vi.fn();

  await expect(initializeDashboardLogic(sessionService, push, setUser)).rejects.toThrow('boom');
    expect(push).not.toHaveBeenCalled();
    expect(setUser).not.toHaveBeenCalled();
  });
});
