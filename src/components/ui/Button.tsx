import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/cn';

type ButtonHierarchy = 'primary' | 'secondary' | 'tertiary' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  hierarchy?: ButtonHierarchy;
  size?: ButtonSize;
  iconOnly?: boolean;
  iconLeading?: ReactNode;
  iconTrailing?: ReactNode;
  href?: string;
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 gap-1 rounded-lg px-3 text-sm [&_svg]:size-4',
  md: 'h-10 gap-1.5 rounded-lg px-3.5 text-sm [&_svg]:size-5',
  lg: 'h-11 gap-1.5 rounded-lg px-4 text-md [&_svg]:size-5',
};

const iconOnlySizeClass: Record<ButtonSize, string> = {
  sm: 'size-9 rounded-lg [&_svg]:size-4',
  md: 'size-10 rounded-lg [&_svg]:size-5',
  lg: 'size-11 rounded-lg [&_svg]:size-5',
};

const hierarchyClass: Record<ButtonHierarchy, string> = {
  primary:
    'bg-(--color-brand) text-white shadow-sm hover:bg-(--color-brand-hover) focus-visible:ring-(--color-brand)/40',
  secondary:
    'border border-(--color-border) bg-(--color-surface) text-(--color-ink) shadow-sm hover:bg-(--color-surface-muted) focus-visible:ring-(--color-brand)/30',
  tertiary:
    'text-(--color-ink) hover:bg-(--color-surface-muted) focus-visible:ring-(--color-brand)/30',
  link: 'text-(--color-brand) hover:text-(--color-brand-hover) focus-visible:ring-(--color-brand)/30',
};

export function Button({
  hierarchy = 'primary',
  size = 'md',
  iconOnly = false,
  iconLeading,
  iconTrailing,
  className,
  type = 'button',
  children,
  href,
  ...props
}: ButtonProps) {
  const isLinkStyle = hierarchy === 'link';

  const classes = cn(
    'inline-flex items-center justify-center font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
    isLinkStyle
      ? 'gap-1 rounded-md px-0.5 text-sm'
      : iconOnly
        ? iconOnlySizeClass[size]
        : sizeClass[size],
    hierarchyClass[hierarchy],
    className,
  );

  const content = (
    <>
      {iconLeading ? <span className="inline-flex shrink-0">{iconLeading}</span> : null}
      {children}
      {iconTrailing ? <span className="inline-flex shrink-0">{iconTrailing}</span> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {content}
    </button>
  );
}
