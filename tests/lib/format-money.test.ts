import { describe, expect, it } from 'vitest';

import { formatMoney } from '@/lib/format-money';

describe('formatMoney', () => {
  it('formats UAH for uk locale with a stable hryvnia sign', () => {
    expect(formatMoney({ amount: 1250, currency: 'UAH' }, 'uk-UA')).toBe('1\u00a0250\u00a0₴');
    expect(formatMoney({ amount: 32000, currency: 'UAH' }, 'uk-UA')).toBe('32\u00a0000\u00a0₴');
  });

  it('formats UAH for en locale', () => {
    expect(formatMoney({ amount: 99, currency: 'UAH' }, 'en-US')).toBe('₴99');
    expect(formatMoney({ amount: 32000, currency: 'UAH' }, 'en-US')).toBe('₴32,000');
  });
});
