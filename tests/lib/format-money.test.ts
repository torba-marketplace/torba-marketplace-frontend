import { describe, expect, it } from 'vitest';

import { formatMoney } from '@/lib/format-money';

describe('formatMoney', () => {
  it('formats UAH for uk locale', () => {
    const formatted = formatMoney({ amount: 1250, currency: 'UAH' }, 'uk-UA');

    expect(formatted.replace(/\s/g, ' ')).toContain('1');
    expect(formatted).toMatch(/1250|1[\s\u00a0]250/);
  });

  it('formats UAH for en locale', () => {
    expect(formatMoney({ amount: 99, currency: 'UAH' }, 'en-US')).toMatch(/99/);
  });
});
