import Image from 'next/image';
import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/cn';

const FULL_WIDTH = 146;
const FULL_HEIGHT = 31;
const MARK_SIZE = 31;

type LogoProps = {
  priority?: boolean;
  variant?: 'full' | 'mark';
  className?: string;
};

export function Logo({ priority = false, variant = 'full', className }: LogoProps) {
  const isMark = variant === 'mark';

  return (
    <Link href="/" className={cn('inline-flex shrink-0', className)}>
      <Image
        src={isMark ? '/icons/Brandmark.svg' : '/icons/Logo.svg'}
        alt={siteConfig.name}
        width={isMark ? MARK_SIZE : FULL_WIDTH}
        height={isMark ? MARK_SIZE : FULL_HEIGHT}
        className={isMark ? 'size-8' : 'h-7.75 w-auto'}
        priority={priority}
        unoptimized
      />
    </Link>
  );
}
