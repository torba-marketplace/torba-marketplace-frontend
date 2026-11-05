import { describe, expect, it } from 'vitest';

import { localized } from '@/lib/localized';

const label = { uk: 'Меблі', en: 'Furniture' };

describe('localized', () => {
  it('returns the matching locale string', () => {
    expect(localized(label, 'en')).toBe('Furniture');
    expect(localized(label, 'uk')).toBe('Меблі');
  });

  it('falls back to Ukrainian for unknown locales', () => {
    expect(localized(label, 'pl')).toBe('Меблі');
  });
});
