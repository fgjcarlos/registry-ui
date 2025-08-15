import { describe, it, expect } from 'vitest';

describe('useDashboard - placeholder', () => {
  it('placeholder test to avoid mounting client hooks in worker tests', () => {
    expect(true).toBe(true);
  });
});
