import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listImagesPaginated, RegistryApiService } from '../src/services/registryApiService';

type MockResponseInit = {
  ok: boolean;
  status?: number;
  statusText?: string;
  json?: () => Promise<unknown>;
  text?: () => Promise<string>;
};

const makeMockFetch = (init: MockResponseInit) => {
  const resp = {
    ok: init.ok,
    status: init.status ?? (init.ok ? 200 : 500),
    statusText: init.statusText ?? '',
    json: init.json ?? (async () => ({})),
    text: init.text ?? (async () => ''),
  } as unknown as Response;

  return vi.fn(async () => resp);
};

describe('RegistryApiService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('listImagesPaginated: returns parsed data on success', async () => {
    global.fetch = makeMockFetch({
      ok: true,
      json: async () => ({ images: [{ name: 'img1', tags: ['latest'] }], nextPage: 2 })
    }) as unknown as typeof global.fetch;

    const res = await listImagesPaginated(1, 10);
    expect(res.images).toHaveLength(1);
    expect(res.images[0].name).toBe('img1');
    expect(res.nextPage).toBe(2);
  });

  it('listImagesPaginated: throws on non-ok with JSON error body', async () => {
    global.fetch = makeMockFetch({
      ok: false,
      statusText: 'Unauthorized',
      json: async () => ({ error: 'Unauthorized' })
    }) as unknown as typeof global.fetch;

    await expect(listImagesPaginated(1, 10)).rejects.toThrow();
  });

  it('listImagesPaginated: throws on invalid JSON response', async () => {
    global.fetch = makeMockFetch({
      ok: true,
      json: async () => { throw new Error('invalid json'); },
      text: async () => 'not-json'
    }) as unknown as typeof global.fetch;

    await expect(listImagesPaginated(1, 10)).rejects.toThrow(/Invalid JSON response/);
  });

  it('getRepositoryTags: returns tags array on success', async () => {
    global.fetch = makeMockFetch({
      ok: true,
      json: async () => ({ tags: ['v1', 'v2'] })
    }) as unknown as typeof global.fetch;

    const tags = await RegistryApiService.getRepositoryTags('http://example.com', 'repo', 'token', 'bearer');
    expect(tags).toEqual(['v1', 'v2']);
  });

  it('getRepositoryTags: returns empty array when tags missing', async () => {
    global.fetch = makeMockFetch({
      ok: true,
      json: async () => ({})
    }) as unknown as typeof global.fetch;

    const tags = await RegistryApiService.getRepositoryTags('http://example.com', 'repo', 'token', 'bearer');
    expect(tags).toEqual([]);
  });

  it('getRepositoryTags: throws on non-ok response', async () => {
    global.fetch = makeMockFetch({
      ok: false,
      status: 500,
      statusText: 'Server Error'
    }) as unknown as typeof global.fetch;

    await expect(RegistryApiService.getRepositoryTags('http://example.com', 'repo', 'token', 'bearer')).rejects.toThrow();
  });
});
