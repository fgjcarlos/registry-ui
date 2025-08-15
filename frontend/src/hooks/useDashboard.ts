"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionService } from '@/services/sessionService';
import { listImagesPaginated } from '@/services/registryApiService';
import { PaginatedImagesResponseSchema } from '@/validators/imageValidators';
import { useAppStore } from '@/store/useAppStore';

export function useDashboard() {
  const router = useRouter();

  // Zustand selectors
  const userInfo = useAppStore((s) => s.user);
  const registryImages = useAppStore((s) => s.registryImages);
  const totalImages = useAppStore((s) => s.totalImages);
  const page = useAppStore((s) => s.page);
  const isLoading = useAppStore((s) => s.isLoading);
  const error = useAppStore((s) => s.error);

  const setUser = useAppStore((s) => s.setUser);
  const setImages = useAppStore((s) => s.setImages);
  const appendImages = useAppStore((s) => s.appendImages);
  const setPage = useAppStore((s) => s.setPage);
  const setLoading = useAppStore((s) => s.setLoading);
  const setError = useAppStore((s) => s.setError);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const user = await SessionService.getCurrentUser();
        if (!user) {
          router.push('/');
          return;
        }
        setUser(user);
      } catch (err) {
        console.error('Failed to get user info:', err);
        router.push('/');
      }
    };

    initializeDashboard();
  }, [router, setUser]);

  useEffect(() => {
    if (!userInfo) return;

    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await listImagesPaginated(page, 10);
        const parsedData = PaginatedImagesResponseSchema.parse(data);

        if (page === 1) {
          setImages(parsedData.images, parsedData.images.length);
        } else {
          appendImages(parsedData.images);
        }

        if (typeof parsedData.nextPage === 'number') {
          setPage(parsedData.nextPage);
        }
      } catch (err) {
        console.error('Failed to fetch registry images:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch registry data');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [userInfo, page, setImages, appendImages, setPage, setLoading, setError]);

  const handleRefresh = async () => {
    if (!userInfo) return;

    try {
      setLoading(true);
      setError(null);

      const { images, nextPage } = await listImagesPaginated(1, 10);

      setImages(images, images.length);

      if (typeof nextPage === 'number') setPage(nextPage);
    } catch (err) {
      console.error('Failed to refresh registry images:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh registry data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await SessionService.clearSession();
    useAppStore.getState().clear();
    router.push('/');
  };

  return {
    registryInfo: { images: registryImages, totalImages, registryUrl: userInfo?.registryUrl ?? '' },
    isLoading,
    error,
    userInfo,
    handleRefresh,
    handleLogout,
  };
}
