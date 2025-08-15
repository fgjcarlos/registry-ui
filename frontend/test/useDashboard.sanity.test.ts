import { describe, it, expect } from 'vitest';

describe('sanity', () => {
  it('runs a trivial test and logs', () => {
    console.log('[sanity] trivial test running');
    expect(1 + 1).toBe(2);
  });
});
