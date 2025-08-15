import { describe, it, expect } from 'vitest';
import { SaveSessionResponseSchema, GetSessionResponseSchema } from '../src/validators/authValidators';

describe('authValidators', () => {
  it('parses successful save session response', () => {
    const data = { success: true, user: { username: 'alice', registryUrl: 'https://example.com' } };
    const parsed = SaveSessionResponseSchema.parse(data);
    expect(parsed).toBeTruthy();
  });

  it('parses error-only response', () => {
    const data = { error: 'Unauthorized' };
    const parsed = SaveSessionResponseSchema.parse(data);
    expect(parsed).toBeTruthy();
  });

  it('parses get session response', () => {
    const data = { authenticated: true, user: { username: 'alice', registryUrl: 'https://example.com' } };
    const parsed = GetSessionResponseSchema.parse(data);
    expect(parsed.authenticated).toBe(true);
  });
});
