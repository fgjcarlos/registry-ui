import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SessionService } from '../src/services/sessionService';

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

describe('SessionService.saveSession', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns success on 200 response', async () => {
    global.fetch = makeMockFetch({
      ok: true,
      json: async () => ({ success: true, user: { username: 'bob', registryUrl: 'https://reg' } })
    }) as unknown as typeof global.fetch;

    const res = await SessionService.saveSession('bob', 'pw', 'https://reg');
    expect(res.success).toBe(true);
    expect(res.user).toBeTruthy();
  });

  it('returns error on 401 response', async () => {
    global.fetch = makeMockFetch({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized' })
    }) as unknown as typeof global.fetch;

    const res = await SessionService.saveSession('bob', 'wrong', 'https://reg');
    expect(res.success).toBe(false);
    expect(res.error).toBeTruthy();
  });
});
