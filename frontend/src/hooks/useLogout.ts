import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export function useLogout() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const logout = useAppStore((s) => s.logout);
  const router = useRouter();

  const setLoading = useAppStore.getState().setLoading;
  const clearStore = useAppStore.getState().clear;

  const open = () => setDialogOpen(true);
  const close = () => setDialogOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      // force-clear loading and ensure store reset in case of unexpected behaviour
      try {
        setLoading(false);
      } catch {
        /* ignore */
      }
      try {
        clearStore();
      } catch {
        /* ignore */
      }
      close();

      // navigate to root (login) so UI doesn't remain on the dashboard loading state
      try {
        router.push('/');
      } catch {
        /* ignore */
      }
    }
  };

  return { dialogOpen, open, close, handleLogout };
}

export default useLogout;
