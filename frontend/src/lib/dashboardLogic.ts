import { UserInfo, RegistryImage } from '@/types';

export type SessionServiceLike = { getCurrentUser: () => Promise<UserInfo | null> };
export type RegistryApiLike = {
  listImagesPaginated: (page: number, pageSize: number) => Promise<{ images: RegistryImage[]; nextPage?: number | null }>;
};

export async function initializeDashboardLogic(
  sessionService: SessionServiceLike,
  routerPush: (path: string) => void,
  setUser: (u: UserInfo | null) => void
) {
  const user = await sessionService.getCurrentUser();
  if (!user) {
    routerPush('/');
    return null;
  }
  setUser(user);
  return user;
}

export async function fetchImagesLogic(
  registryApi: RegistryApiLike,
  page: number,
  setLoading: (v: boolean) => void,
  setError: (e: string | null) => void,
  setImages: (images: RegistryImage[], total?: number) => void,
  appendImages: (images: RegistryImage[]) => void,
  setPage: (p: number) => void,
  parseFn?: (data: { images: RegistryImage[]; nextPage?: number | null }) => { images: RegistryImage[]; nextPage?: number | null }
) {
  try {
    setLoading(true);
    setError(null);

    const data = await registryApi.listImagesPaginated(page, 10);
    const parsed = parseFn ? parseFn(data) : data;

    if (page === 1) {
      setImages(parsed.images, parsed.images.length);
    } else {
      appendImages(parsed.images);
    }

    if (typeof parsed.nextPage === 'number') {
      setPage(parsed.nextPage);
    }

    return parsed;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    setError(msg);
    throw err;
  } finally {
    setLoading(false);
  }
}

const dashboardLogic = { initializeDashboardLogic, fetchImagesLogic };
export default dashboardLogic;
