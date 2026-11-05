import { describe, expect, it } from 'vitest';

import { cn } from '@/lib/cn';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });

  it('ignores nullish values', () => {
    expect(cn('btn', null, undefined, 'btn--primary')).toBe('btn btn--primary');
  });
});
