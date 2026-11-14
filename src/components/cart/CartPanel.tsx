'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';

import { ProductIcon } from '@/components/product/ProductIcon';
import {
  cartMoney,
  countForm,
  groupCartBySeller,
  summarizeCart,
} from '@/lib/cart-summary';
import { catalogHref } from '@/lib/catalog-query';
import { cn } from '@/lib/cn';
import { localized } from '@/lib/localized';
import type { CartItem, CartSeller } from '@/types/cart';

const focusClass =
  'outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand)/40';

function subscribeMdUp(onStoreChange: () => void) {
  const media = window.matchMedia('(min-width: 768px)');
  media.addEventListener('change', onStoreChange);
  return () => media.removeEventListener('change', onStoreChange);
}

function useIsMdUp() {
  return useSyncExternalStore(
    subscribeMdUp,
    () => window.matchMedia('(min-width: 768px)').matches,
    () => true,
  );
}

const actionClass = `inline-flex h-11 w-full items-center justify-center rounded-lg border px-[18px] text-md leading-6 font-semibold transition-colors ${focusClass}`;

export type CartPanelProps = {
  loading: boolean;
  items: CartItem[];
  onClose: () => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onToggleSelected: (id: string) => void;
};

export function CartPanel({
  loading,
  items,
  onClose,
  onQuantityChange,
  onRemove,
  onToggleSelected,
}: CartPanelProps) {
  const { t } = useTranslation();
  const summary = summarizeCart(items);
  const countKey = countForm(summary.totalQuantity);

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b border-(--color-dark-150) px-4 md:h-[88px] md:px-7">
        <h2
          id="cart-title"
          className="text-lg leading-7 font-semibold text-(--color-dark-900) md:text-2xl md:leading-8"
        >
          {t('cart.title')}
        </h2>
        {loading ? null : (
          <span className="rounded-md bg-(--color-dark-100) px-2 py-[3px] text-xs leading-[18px] font-semibold text-(--color-dark-600) md:px-[9px] md:text-sm md:leading-5">
            {t(`cart.count.${countKey}`, { count: summary.totalQuantity })}
          </span>
        )}
        <button
          type="button"
          id="cart-close"
          className={`ml-auto inline-flex h-11 w-10 items-center justify-end md:size-6 ${focusClass}`}
          aria-label={t('cart.close')}
          onClick={onClose}
        >
          <ProductIcon src="/icons/cart/close.svg" width={24} height={24} />
        </button>
      </header>

      {loading ? (
        <CartLoading />
      ) : items.length === 0 ? (
        <CartEmpty onClose={onClose} />
      ) : (
        <CartFilled
          items={items}
          onClose={onClose}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
          onToggleSelected={onToggleSelected}
        />
      )}
    </div>
  );
}

function CartFilled({
  items,
  onClose,
  onQuantityChange,
  onRemove,
  onToggleSelected,
}: Omit<CartPanelProps, 'loading'>) {
  const { t, i18n } = useTranslation();
  const summary = summarizeCart(items);
  const groups = groupCartBySeller(items);
  const payableKey = countForm(summary.payableQuantity);
  const unavailableKey = countForm(summary.unavailableQuantity);
  const canCheckout = summary.payableQuantity > 0;

  return (
    <>
      <div
        className={cn(
          'min-h-0 flex-1 overflow-y-auto px-4 md:px-7',
          summary.unavailableQuantity > 0 && 'pt-5',
        )}
      >
        {summary.unavailableQuantity > 0 ? (
          <div className="flex items-start gap-2.5 rounded-lg bg-[#fff5f5] p-3">
            <ProductIcon src="/icons/cart/alert.svg" width={20} height={20} />
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-5 font-semibold text-(--color-red-600)">
                {t(`cart.unavailableTitle.${unavailableKey}`, {
                  count: summary.unavailableQuantity,
                })}
              </p>
              <p className="mt-1 text-xs leading-[18px] text-(--color-dark-600)">
                {t(`cart.unavailableBody.${unavailableKey}`)}
              </p>
            </div>
          </div>
        ) : null}

        {groups.map((group) => (
          <section key={group.seller.id}>
            <SellerRow seller={group.seller} locale={i18n.language} onClose={onClose} />
            {group.items.map((item) => (
              <CartLine
                key={item.id}
                item={item}
                locale={i18n.language}
                onQuantityChange={onQuantityChange}
                onRemove={onRemove}
                onToggleSelected={onToggleSelected}
              />
            ))}
          </section>
        ))}
      </div>

      <footer className="flex shrink-0 flex-col gap-4 border-t border-(--color-dark-150) p-4 md:p-7">
        <SummaryRow
          label={t('cart.subtotal', {
            items: t(`cart.count.${payableKey}`, { count: summary.payableQuantity }),
          })}
          value={cartMoney(summary.subtotal)}
        />
        <SummaryRow
          label={t('cart.discount')}
          value={`\u2212${cartMoney(summary.discount)}`}
          valueClassName="text-(--color-accent-green)"
        />
        <SummaryRow
          label={t('cart.delivery')}
          value={summary.delivery === 0 ? t('cart.free') : cartMoney(summary.delivery)}
          valueClassName="text-(--color-accent-green)"
        />
        <div className="flex items-center justify-between gap-3 border-t border-(--color-dark-150) pt-3">
          <p className="text-md leading-6 font-semibold text-(--color-dark-900)">{t('cart.total')}</p>
          <p className="text-2xl leading-8 font-semibold text-(--color-dark-900)">
            {cartMoney(summary.total)}
          </p>
        </div>
        <div className="flex flex-col gap-2 md:gap-2.5">
          {canCheckout ? (
            <Link href="/checkout" className={`${actionClass} border-(--color-primary-700) bg-(--color-primary-700) text-white hover:bg-(--color-primary-800)`} onClick={onClose}>
              {t('cart.checkout')}
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className={`${actionClass} cursor-not-allowed border-(--color-primary-200) bg-(--color-primary-200) text-white`}
            >
              {t('cart.checkout')}
            </button>
          )}
          <button
            type="button"
            className={`${actionClass} border-(--color-primary-100) bg-(--color-primary-100) text-(--color-primary-700) hover:bg-(--color-primary-200)`}
            onClick={onClose}
          >
            {t('cart.continue')}
          </button>
        </div>
        <p className="text-center text-xs leading-[18px] text-(--color-dark-600)">
          {t('cart.deliveryNote')}
        </p>
      </footer>
    </>
  );
}

function SellerRow({
  seller,
  locale,
  onClose,
}: {
  seller: CartSeller;
  locale: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const href = catalogHref({
    category: null,
    sub: null,
    min: null,
    max: null,
    sellers: [seller.id],
    delivery: [],
    page: 1,
    sort: 'recommended',
  });

  return (
    <div className="flex items-center gap-3 pt-4">
      <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-(--color-dark-100)">
        {seller.avatarUrl ? (
          <Image
            src={seller.avatarUrl}
            alt=""
            fill
            sizes="40px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-sm leading-5 font-medium text-(--color-dark-800)">
          <span className="truncate">{seller.name}</span>
          {seller.verified ? (
            <ProductIcon src="/icons/badge-check.svg" width={16} height={16} />
          ) : null}
        </p>
        <p className="truncate text-xs leading-[18px] text-(--color-dark-600)">
          {localized(seller.dispatch, locale)}
        </p>
      </div>
      <Link
        href={href}
        aria-label={t('cart.sellerItems', { seller: seller.name })}
        className={`inline-flex size-5 shrink-0 items-center justify-center ${focusClass}`}
        onClick={onClose}
      >
        <ProductIcon src="/icons/cart/chevron.svg" width={20} height={20} />
      </Link>
    </div>
  );
}

function CartLine({
  item,
  locale,
  onQuantityChange,
  onRemove,
  onToggleSelected,
}: {
  item: CartItem;
  locale: string;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onToggleSelected: (id: string) => void;
}) {
  const { t } = useTranslation();
  const desktop = useIsMdUp();
  const title = localized(item.title, locale);
  const unavailable = !item.available;
  const stepper = (
    <QuantityStepper
      quantity={item.quantity}
      disabled={unavailable}
      size={desktop ? 'sm' : 'md'}
      onChange={(quantity) => onQuantityChange(item.id, quantity)}
    />
  );

  return (
    <article className="border-b border-(--color-dark-150) py-5 md:py-6">
      <div className="flex items-start gap-3 md:gap-4">
        <CartCheckbox
          checked={item.selected}
          disabled={unavailable}
          label={t('cart.select', { name: title })}
          onToggle={() => onToggleSelected(item.id)}
        />
        <div
          className={cn(
            'relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-(--color-dark-100) md:h-28 md:w-[104px] md:rounded-[10px]',
            unavailable && 'opacity-50',
          )}
        >
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt="" fill sizes="104px" className="object-cover" />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 md:gap-2">
          <div className="flex items-start gap-1 md:gap-3">
            <p className="min-w-0 flex-1 text-sm leading-5 font-semibold text-(--color-dark-900)">
              {title}
            </p>
            <button
              type="button"
              className={`inline-flex size-5 shrink-0 items-center justify-center ${focusClass}`}
              aria-label={t('cart.remove', { name: title })}
              onClick={() => onRemove(item.id)}
            >
              <ProductIcon src="/icons/cart/trash.svg" width={20} height={20} />
            </button>
          </div>
          {unavailable ? null : (
            <p className="text-xs leading-[18px] text-(--color-dark-600)">
              {t('cart.soldBy', { seller: item.seller.name })}
            </p>
          )}
          {item.variant ? (
            <p className="text-xs leading-[18px] text-(--color-dark-600)">
              {localized(item.variant, locale)}
            </p>
          ) : null}
          {unavailable ? (
            <p className="text-xs leading-[18px] font-semibold text-(--color-red-600)">
              {t('cart.outOfStock')}
            </p>
          ) : null}
          <p className="flex items-center gap-2">
            <span
              className={cn(
                'text-md leading-6 font-semibold',
                unavailable ? 'text-(--color-dark-600)' : 'text-(--color-dark-900)',
              )}
            >
              {cartMoney(item.price)}
            </span>
            {item.oldPrice ? (
              <span className="text-xs leading-[18px] text-(--color-dark-400)">
                {cartMoney(item.oldPrice)}
              </span>
            ) : null}
          </p>
          {desktop ? (
            <div className="flex items-center justify-between gap-3">
              {stepper}
              {unavailable ? (
                <p className="text-xs leading-[18px] text-(--color-dark-600)">{t('cart.excluded')}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      {desktop ? null : (
        <div className="mt-3 flex items-center justify-between gap-3">
          {stepper}
          {unavailable ? (
            <p className="text-xs leading-[18px] text-(--color-dark-600)">{t('cart.excluded')}</p>
          ) : null}
        </div>
      )}
    </article>
  );
}

function CartCheckbox({
  checked,
  disabled,
  label,
  onToggle,
}: {
  checked: boolean;
  disabled: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={disabled ? false : checked}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        `inline-flex size-5 shrink-0 items-center justify-center rounded-[6px] border ${focusClass}`,
        disabled
          ? 'cursor-not-allowed border-(--color-dark-150) bg-(--color-dark-100)'
          : checked
            ? 'border-(--color-primary-700) bg-(--color-primary-50)'
            : 'border-(--color-dark-200) bg-white',
      )}
    >
      {checked && !disabled ? (
        <ProductIcon src="/icons/cart/check.svg" width={14} height={14} />
      ) : null}
    </button>
  );
}

function QuantityStepper({
  quantity,
  disabled,
  size,
  onChange,
}: {
  quantity: number;
  disabled: boolean;
  size: 'sm' | 'md';
  onChange: (quantity: number) => void;
}) {
  const { t } = useTranslation();
  const buttonClass = size === 'md' ? 'size-9' : 'size-8';

  return (
    <div
      className={cn(
        'inline-flex h-8 items-center rounded-md border border-(--color-dark-150)',
        size === 'md' && 'h-9',
        disabled && 'pointer-events-none opacity-40',
      )}
    >
      <button
        type="button"
        className={`inline-flex items-center justify-center disabled:opacity-100 ${buttonClass} ${focusClass}`}
        aria-label={t('cart.decrease')}
        disabled={disabled || quantity <= 1}
        onClick={() => onChange(quantity - 1)}
      >
        <ProductIcon src="/icons/cart/minus.svg" width={16} height={16} />
      </button>
      <span className="w-7 text-center text-xs leading-[18px] font-semibold text-(--color-dark-900)">
        {quantity}
      </span>
      <button
        type="button"
        className={`inline-flex items-center justify-center ${buttonClass} ${focusClass}`}
        aria-label={t('cart.increase')}
        disabled={disabled}
        onClick={() => onChange(quantity + 1)}
      >
        <ProductIcon src="/icons/cart/plus.svg" width={16} height={16} />
      </button>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm leading-5">
      <p className="text-(--color-dark-600)">{label}</p>
      <p className={cn('shrink-0 font-medium text-(--color-dark-900)', valueClassName)}>{value}</p>
    </div>
  );
}

function CartEmpty({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-6 pb-16 text-center md:px-12 md:pb-20">
        <ProductIcon src="/image/cart/empty.svg" width={200} height={164} />
        <div className="flex w-full flex-col gap-3">
          <p className="text-2xl leading-8 font-semibold text-(--color-dark-900)">
            {t('cart.emptyTitle')}
          </p>
          <div className="flex flex-col gap-3.5 text-sm leading-5 text-(--color-dark-600)">
            <p>{t('cart.emptyLead')}</p>
            <p>{t('cart.emptyHint')}</p>
          </div>
        </div>
        <Link
          href="/catalog"
          className={`${actionClass} max-w-[260px] border-(--color-primary-700) bg-(--color-primary-700) text-white hover:bg-(--color-primary-800)`}
          onClick={onClose}
        >
          {t('cart.toCatalog')}
        </Link>
      </div>
      <footer className="shrink-0 border-t border-(--color-dark-150) p-4 md:p-7">
        <p className="text-center text-xs leading-[18px] text-(--color-dark-600)">
          {t('cart.emptyFooter')}
        </p>
      </footer>
    </>
  );
}

function CartLoading() {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pt-4 md:px-7 md:pt-6">
        <p className="inline-flex items-center gap-2 text-sm leading-5 text-(--color-dark-600)">
          <span className="inline-flex motion-safe:animate-spin">
            <ProductIcon src="/icons/cart/spinner.svg" width={16} height={16} />
          </span>
          {t('cart.loading')}
        </p>
        <CartSkeleton />
        <CartSkeleton />
      </div>
      <footer className="flex shrink-0 flex-col gap-5 border-t border-(--color-dark-150) p-4 md:p-7">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="h-3.5 w-[140px] animate-pulse rounded bg-(--color-dark-100)" />
            <span className="h-3.5 w-20 animate-pulse rounded bg-(--color-dark-100)" />
          </div>
        ))}
        <div className="flex items-center justify-between py-3">
          <span className="h-6 w-40 animate-pulse rounded bg-(--color-dark-100)" />
          <span className="h-7 w-[120px] animate-pulse rounded bg-(--color-dark-100)" />
        </div>
        <button
          type="button"
          disabled
          className={`${actionClass} cursor-not-allowed border-(--color-primary-200) bg-(--color-primary-200) text-white`}
        >
          {t('cart.checkout')}
        </button>
        <button
          type="button"
          disabled
          className={`${actionClass} cursor-not-allowed border-(--color-primary-50) bg-(--color-primary-50) text-(--color-primary-300)`}
        >
          {t('cart.continue')}
        </button>
        <p className="text-center text-xs leading-[18px] text-(--color-dark-600)">
          {t('cart.loadingNote')}
        </p>
      </footer>
    </>
  );
}

function CartSkeleton() {
  return (
    <div className="flex gap-4 border-b border-(--color-dark-150) pb-6">
      <span className="h-24 w-20 shrink-0 animate-pulse rounded bg-(--color-dark-100) md:h-28 md:w-[104px]" />
      <div className="flex min-w-0 flex-1 flex-col gap-3.5">
        <span className="h-[18px] w-full max-w-[250px] animate-pulse rounded bg-(--color-dark-100)" />
        <span className="h-3 w-full max-w-40 animate-pulse rounded bg-(--color-dark-100)" />
        <span className="h-3 w-full max-w-[120px] animate-pulse rounded bg-(--color-dark-100)" />
        <span className="h-5 w-[100px] animate-pulse rounded bg-(--color-dark-100)" />
        <span className="h-8 w-[92px] animate-pulse rounded bg-(--color-dark-100)" />
      </div>
    </div>
  );
}
