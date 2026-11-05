import { describe, expect, it } from 'vitest';

import { filterLocations, popularLocations, searchLocations } from '@/config/locations';

describe('filterLocations', () => {
  it('returns all locations when the query is empty', () => {
    expect(filterLocations(popularLocations, '  ', 'uk')).toHaveLength(popularLocations.length);
  });

  it('matches city names in the active locale', () => {
    const result = filterLocations(popularLocations, 'боярка', 'uk');
    expect(result.map((item) => item.id)).toEqual(['boyarka']);
  });

  it('matches region names', () => {
    const result = filterLocations(popularLocations, 'київська', 'uk');
    expect(result.map((item) => item.id)).toEqual(['boyarka']);
  });
});

describe('searchLocations', () => {
  it('shows popular cities until the user types', () => {
    expect(searchLocations('  ', 'uk').map((item) => item.id)).toEqual([
      'kryvyi-rih',
      'mykolaiv',
      'boyarka',
      'zhytomyr',
      'ivano-frankivsk',
    ]);
  });

  it('finds cities outside the popular list', () => {
    expect(searchLocations('львів', 'uk').map((item) => item.id)).toContain('lviv');
    expect(searchLocations('odesa', 'en').map((item) => item.id)).toEqual(['odesa']);
  });

  it('finds Kyiv even though it is not in the popular list', () => {
    expect(searchLocations('київ', 'uk').map((item) => item.id)).toContain('kyiv');
  });
});
