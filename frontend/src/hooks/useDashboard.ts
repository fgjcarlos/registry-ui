"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SessionService } from '@/services/sessionService';
import { listImagesPaginated } from '@/services/registryApiService';
import {
  initializeDashboardLogic,
  fetchImagesLogic,
} from '@/lib/dashboardLogic';
import { useAppStore } from '@/store/useAppStore';

console.log('[hook] useDashboard module loaded');

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
    // delegate to pure logic for easier testing
    initializeDashboardLogic(SessionService, router.push, setUser).catch((err) => {
      console.error('initializeDashboardLogic error', err);
    });
  }, [router, setUser]);

  useEffect(() => {
    if (!userInfo) return;

    // delegate to pure logic for easier testing
    fetchImagesLogic(
      { listImagesPaginated },
      page,
      setLoading,
      setError,
      setImages,
      appendImages,
      setPage
    ).catch((err) => {
      console.error('fetchImagesLogic error', err);
    });
  }, [userInfo, page, setImages, appendImages, setPage, setLoading, setError]);

  const handleRefresh = async () => {
  console.log('[hook] handleRefresh called');
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
  console.log('[hook] handleLogout called');
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
