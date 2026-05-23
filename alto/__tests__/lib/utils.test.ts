import { describe, it, expect } from 'vitest';
import { cn, sleep, formatCurrency } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => { expect(cn('a', 'b')).toBe('a b'); });
  it('resolves Tailwind conflicts', () => { expect(cn('p-2', 'p-4')).toBe('p-4'); });
});
describe('sleep', () => {
  it('resolves after delay', async () => {
    const t = Date.now(); await sleep(50); expect(Date.now() - t).toBeGreaterThanOrEqual(40);
  });
});
describe('formatCurrency', () => {
  it('formats with ₹ symbol', () => { expect(formatCurrency(1240)).toBe('₹1,240'); });
});
