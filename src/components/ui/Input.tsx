import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/lib/cn';

type InputSize = 'sm' | 'md';
type InputVariant = 'field' | 'search';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  hint?: string;
  error?: string;
  iconLeading?: ReactNode;
  trailing?: ReactNode;
  size?: InputSize;
  variant?: InputVariant;
};

const sizeClass: Record<InputSize, string> = {
  sm: 'h-10 text-sm',
  md: 'h-11 text-sm',
};

const iconClass: Record<InputSize, string> = {
  sm: 'left-3 [&_svg]:size-4',
  md: 'left-3.5 [&_svg]:size-5',
};

const iconPaddingClass: Record<InputSize, string> = {
  sm: 'pr-3 pl-9',
  md: 'pr-4 pl-11',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    iconLeading,
    trailing,
    size = 'md',
    variant = 'field',
    className,
    id,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const message = error ?? hint;
  const messageId = message ? `${inputId}-message` : undefined;

  return (
    <div className={cn('flex w-full min-w-0 flex-col', className)}>
      {label ? (
        <label htmlFor={inputId} className="mb-1.5 text-sm font-medium text-(--color-ink)">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {iconLeading ? (
          <span
            className={cn(
              'pointer-events-none absolute top-1/2 inline-flex -translate-y-1/2 text-(--color-muted)',
              iconClass[size],
            )}
          >
            {iconLeading}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          className={cn(
            'w-full text-(--color-ink) outline-none placeholder:text-(--color-muted) disabled:cursor-not-allowed disabled:opacity-50',
            sizeClass[size],
            iconLeading ? iconPaddingClass[size] : 'px-3.5',
            trailing && 'pr-16',
            variant === 'search'
              ? 'rounded-full border-0 bg-(--color-surface-muted) focus:ring-2 focus:ring-(--color-brand)/30'
              : 'rounded-lg border bg-(--color-surface) shadow-sm focus:ring-2 focus:ring-(--color-brand)/30',
            variant === 'field' &&
              (error ? 'border-red-500' : 'border-(--color-border) focus:border-(--color-brand)'),
          )}
          {...props}
        />
        {trailing ? (
          <span className="absolute top-1/2 right-4 inline-flex -translate-y-1/2">{trailing}</span>
        ) : null}
      </div>
      {message ? (
        <p
          id={messageId}
          className={cn('mt-1.5 text-sm', error ? 'text-red-600' : 'text-(--color-muted)')}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
});
