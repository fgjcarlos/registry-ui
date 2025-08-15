import { create } from 'zustand';
import { RegistryImage } from '@/types';
import { SessionService } from '@/services/sessionService';

type UserInfo = {
  username: string;
  registryUrl: string;
};

type AppState = {
  user: UserInfo | null;
  registryImages: RegistryImage[];
  totalImages: number;
  page: number;
  isLoading: boolean;
  error: string | null;
  setUser: (u: UserInfo | null) => void;
  setImages: (images: RegistryImage[], total?: number) => void;
  appendImages: (images: RegistryImage[]) => void;
  setPage: (p: number) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  login: (username: string, password: string, registryUrl: string) => Promise<{ success: boolean; error?: string; user?: UserInfo }>;
  logout: () => Promise<void>;
  clear: () => void;
};

export const useAppStore = create<AppState>((set: (partial: Partial<AppState> | ((state: AppState) => Partial<AppState>)) => void) => ({
  user: null,
  registryImages: [],
  totalImages: 0,
  page: 1,
  isLoading: false,
  error: null,
  setUser: (u: UserInfo | null) => set({ user: u }),
  setImages: (images: RegistryImage[], total?: number) => set({ registryImages: images, totalImages: typeof total === 'number' ? total : images.length }),
  appendImages: (images: RegistryImage[]) => set((state: AppState) => ({ registryImages: [...state.registryImages, ...images], totalImages: state.totalImages + images.length })),
  setPage: (p: number) => set({ page: p }),
  setLoading: (v: boolean) => set({ isLoading: v }),
  setError: (e: string | null) => set({ error: e }),
  login: async (username: string, password: string, registryUrl: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await SessionService.saveSession(username, password, registryUrl);
      if (res.success && res.user) {
        set({ user: res.user });
      }
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ error: msg });
      return { success: false, error: msg } as unknown as { success: boolean; error?: string };
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    set({ isLoading: true });
    try {
      await SessionService.clearSession();
    } catch (err) {
      // ignore error, but set message
      const msg = err instanceof Error ? err.message : String(err);
      set({ error: msg });
    } finally {
      set({ user: null, registryImages: [], totalImages: 0, page: 1, isLoading: false, error: null });
    }
  },
  clear: () => set({ user: null, registryImages: [], totalImages: 0, page: 1, isLoading: false, error: null }),
}));
