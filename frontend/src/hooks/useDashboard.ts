'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RegistryInfo } from '../services/registryApiService';
import { SessionService } from '../services/sessionService';

export function useDashboard() {
  const router = useRouter();
  const [registryInfo, setRegistryInfo] = useState<RegistryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    username: string;
    registryUrl: string;
  } | null>(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const user = await SessionService.getCurrentUser();
        if (!user) {
          router.push('/');
          return;
        }
        setUserInfo(user);
      } catch (err) {
        console.error('Failed to get user info:', err);
        router.push('/');
      }
    };

    initializeDashboard();
  }, [router]);

  useEffect(() => {
    if (!userInfo) return;

    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching images from registry...');
        
        // Use server-side API that handles authentication via HttpOnly cookies
        const response = await fetch('/api/registry/images', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.statusText}`);
        }

        const info = await response.json();
        setRegistryInfo(info);
      } catch (err) {
        console.error('Failed to fetch registry images:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch registry data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [userInfo]);

  const handleRefresh = async () => {
    if (!userInfo) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/registry/images', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.statusText}`);
      }

      const info = await response.json();
      setRegistryInfo(info);
    } catch (err) {
      console.error('Failed to fetch registry images:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch registry data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await SessionService.clearSession();
    router.push('/');
  };

  return {
    registryInfo,
    isLoading,
    error,
    userInfo,
    handleRefresh,
    handleLogout
  };
}
