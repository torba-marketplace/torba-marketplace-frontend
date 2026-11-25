'use client';

import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ProductIcon } from '@/components/product/ProductIcon';
import { Button } from '@/components/ui/Button';
import { countForm, groupCartBySeller, summarizeCart } from '@/lib/cart-summary';
import { useCart } from '@/lib/cart-store';
import { cn } from '@/lib/cn';
import type { CartSeller } from '@/types/cart';

import type { DeliveryDestination, DeliveryDraft, DeliveryMethodId } from './CheckoutDelivery';
import { ApplePaySheet } from './ApplePaySheet';
import { GooglePaySheet } from './GooglePaySheet';
import { formatUaPhone } from './phone';

type PaymentMethod = 'apple' | 'google' | 'card';

const methods: {
  id: PaymentMethod;
  icon: string;
  width: number;
  height: number;
  labelKey: 'checkout.applePay' | 'checkout.googlePay' | 'checkout.card';
}[] = [
  { id: 'apple', icon: '/icons/checkout/apple.svg', width: 20, height: 20, labelKey: 'checkout.applePay' },
  { id: 'google', icon: '/icons/checkout/google-pay.svg', width: 20, height: 20, labelKey: 'checkout.googlePay' },
  { id: 'card', icon: '/icons/checkout/card.svg', width: 24, height: 24, labelKey: 'checkout.card' },
];

const fieldClass =
  'h-11 w-full rounded-lg border border-(--color-dark-300) bg-white px-3.5 text-md leading-6 text-(--color-dark-900) shadow-xs outline-none placeholder:text-(--color-dark-500) focus:border-(--color-primary-700) focus:ring-2 focus:ring-(--color-brand)/30';

function portraitFor(seller: CartSeller) {
  if (seller.id === 'charge34') {
    return '/image/checkout/seller-charge34.png';
  }

  if (seller.id === 'non-di') {
    return '/image/checkout/seller-nondi.png';
  }

  return seller.avatarUrl ?? '/image/product/seller.png';
}

function amountWithHryvnia(amount: number) {
  const grouped = Math.abs(Math.round(amount))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');

  return `${grouped}\u00a0₴`;
}

function digits(value: string, max: number) {
  return value.replace(/\D/g, '').slice(0, max);
}

function formatCardNumber(value: string) {
  return digits(value, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string) {
  const next = digits(value, 4);

  if (next.length <= 2) {
    return next;
  }

  return `${next.slice(0, 2)} / ${next.slice(2)}`;
}

function maskCvv(value: string) {
  return '•'.repeat(value.length);
}

function readCvv(current: string, next: string) {
  const incoming = next.replace(/\D/g, '');
  const kept = next.length - incoming.length;

  if (incoming && kept < current.length) {
    return digits(current.slice(0, kept) + incoming, 3);
  }

  if (next.length < current.length) {
    return current.slice(0, next.length);
  }

  return digits(current + incoming, 3);
}

function formatDestination(destination: DeliveryDestination | undefined, branchPrefix: string) {
  if (!destination?.city || !destination.branch) {
    return undefined;
  }

  return `${destination.city} · ${branchPrefix} ${destination.branch}`;
}

function isCardReady(number: string, expiry: string, cvv: string) {
  const pan = number.replace(/\D/g, '');
  const exp = expiry.replace(/\D/g, '');
  const month = Number(exp.slice(0, 2));

  return pan.length === 16 && exp.length === 4 && month >= 1 && month <= 12 && cvv.length === 3;
}

type CheckoutPaymentProps = {
  draft: DeliveryDraft;
  onEdit: () => void;
};

export function CheckoutPayment({ draft, onEdit }: CheckoutPaymentProps) {
  const { t } = useTranslation();
  const { items, openCart } = useCart();
  const summary = summarizeCart(items);
  const orders = groupCartBySeller(items.filter((item) => item.available && item.selected));
  const itemsKey = countForm(summary.payableQuantity);
  const deliveryLabel = summary.delivery === 0 ? t('checkout.free') : amountWithHryvnia(summary.delivery);
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [googlePayOpen, setGooglePayOpen] = useState(false);
  const [applePayOpen, setApplePayOpen] = useState(false);
  const ready = method === 'card' ? isCardReady(cardNumber, expiry, cvv) : true;
  const singleOrder = orders.length === 1;

  return (
    <div className="flex w-full flex-col items-start gap-4 md:gap-8 xl:flex-row xl:gap-12">
      <div className="flex w-full min-w-0 flex-1 flex-col gap-4 md:gap-6">
        <section className="flex flex-col gap-5 rounded-2xl bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl leading-[30px] font-medium text-(--color-dark-800)">{t('checkout.recipient')}</h2>
            <Button hierarchy="link" type="button" className="h-auto font-semibold" onClick={onEdit}>
              {t('checkout.change')}
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-md leading-6 font-medium text-(--color-dark-800)">
              {draft.firstName} {draft.lastName}
            </p>
            <p className="text-sm leading-5 text-(--color-dark-600)">
              {formatUaPhone(draft.phone)} · {draft.email}
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-5 rounded-2xl bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl leading-[30px] font-medium text-(--color-dark-800)">
              {singleOrder ? t('checkout.receivingOne') : t('checkout.receiving')}
            </h2>
            <Button hierarchy="link" type="button" className="h-auto font-semibold" onClick={onEdit}>
              {t('checkout.change')}
            </Button>
          </div>
          {orders.map((order, index) => (
            <ReceivingOrder
              key={order.seller.id}
              number={index + 1}
              compact={singleOrder}
              seller={order.seller}
              method={draft.methods[order.seller.id]}
              destination={formatDestination(draft.destinations?.[order.seller.id], t('checkout.branchPrefix'))}
            />
          ))}
        </section>

        <section className="flex flex-col gap-5 rounded-2xl bg-white px-4 py-4 sm:px-6">
          <h2 className="text-xl leading-[30px] font-medium text-(--color-dark-800)">{t('checkout.steps.payment')}</h2>
          <div role="radiogroup" aria-label={t('checkout.steps.payment')} className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {methods.map((choice) => {
              const selected = method === choice.id;

              return (
                <button
                  key={choice.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={cn(
                    'flex min-w-0 items-center gap-3 rounded-lg border bg-white p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand)/30',
                    selected ? 'border-(--color-primary-700)' : 'border-(--color-dark-150)',
                  )}
                  onClick={() => {
                    setMethod(choice.id);
                    if (choice.id !== 'google') {
                      setGooglePayOpen(false);
                    }
                    if (choice.id !== 'apple') {
                      setApplePayOpen(false);
                    }
                  }}
                >
                  {selected ? (
                    <ProductIcon src="/icons/checkout/radio-checked.svg" width={16} height={16} />
                  ) : (
                    <span className="size-4 shrink-0 rounded-full border border-(--color-dark-200) bg-white" />
                  )}
                  <ProductIcon src={choice.icon} width={choice.width} height={choice.height} />
                  <span className="text-md leading-6 font-medium whitespace-nowrap text-(--color-dark-800)">
                    {t(choice.labelKey)}
                  </span>
                </button>
              );
            })}
          </div>
          {method === 'card' ? (
            <div className="flex flex-col gap-4">
              <CardField
                label={t('checkout.cardNumber')}
                name="cc-number"
                autoComplete="cc-number"
                inputMode="numeric"
                value={cardNumber}
                placeholder={t('checkout.cardNumberPlaceholder')}
                onChange={(value) => setCardNumber(formatCardNumber(value))}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <CardField
                  label={t('checkout.expiry')}
                  name="cc-exp"
                  autoComplete="cc-exp"
                  inputMode="numeric"
                  value={expiry}
                  placeholder={t('checkout.expiryPlaceholder')}
                  onChange={(value) => setExpiry(formatExpiry(value))}
                />
                <CardField
                  label={t('checkout.cvv')}
                  name="cc-csc"
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  value={maskCvv(cvv)}
                  placeholder={t('checkout.cvvPlaceholder')}
                  onChange={(value) => setCvv(readCvv(cvv, value))}
                />
              </div>
            </div>
          ) : null}
          <div className="flex items-center gap-2.5">
            <ProductIcon src="/icons/checkout/security.svg" width={24} height={24} />
            <p className="text-sm leading-5 text-(--color-dark-600)">{t('checkout.securePayment')}</p>
          </div>
        </section>
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-4 rounded-2xl bg-white p-5 sm:p-7 xl:w-[421px]">
        <div className="flex items-center justify-between gap-3 border-b border-(--color-dark-150) pb-3">
          <h2 className="text-2xl leading-8 font-medium text-(--color-dark-800)">{t('checkout.summaryTitle')}</h2>
          <Button hierarchy="link" type="button" className="h-auto font-semibold" onClick={openCart}>
            {t('checkout.edit')}
          </Button>
        </div>
        <div className="flex items-start justify-between gap-3 text-sm leading-5">
          <p className="text-(--color-dark-600)">
            {t(`checkout.itemsAmount.${itemsKey}`, { count: summary.payableQuantity })}
          </p>
          <p className="font-medium whitespace-nowrap text-(--color-dark-900)">{amountWithHryvnia(summary.total)}</p>
        </div>
        <div className="flex items-start justify-between gap-3 text-sm leading-5">
          <p className="text-(--color-dark-600)">{t('checkout.deliveryCost')}</p>
          <p
            className={cn(
              'font-medium whitespace-nowrap',
              summary.delivery === 0 ? 'text-(--color-accent-green)' : 'text-(--color-dark-900)',
            )}
          >
            {deliveryLabel}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-(--color-dark-150) pt-3">
          <p className="text-md leading-6 font-semibold text-(--color-dark-900)">{t('checkout.due')}</p>
          <p className="text-2xl leading-8 font-semibold whitespace-nowrap text-(--color-dark-900)">
            {amountWithHryvnia(summary.total)}
          </p>
        </div>
        {method === 'google' ? (
          <button
            type="button"
            aria-label={t('checkout.googlePay')}
            className="flex h-[50px] w-full items-center justify-center rounded-[4px] bg-black"
            onClick={() => setGooglePayOpen(true)}
          >
            <span className="relative block h-6 w-[62px]">
              <img
                src="/icons/checkout/gpay-mark.svg"
                alt=""
                width="19.7504"
                height="20.0339"
                className="absolute top-0 left-0"
              />
              <img
                src="/icons/checkout/gpay-wordmark.svg"
                alt=""
                width="35.1016"
                height="22.7251"
                className="absolute top-[1.27px] left-[26.48px]"
              />
            </span>
          </button>
        ) : method === 'apple' ? (
          <button
            type="button"
            aria-label={t('checkout.applePay')}
            className="flex h-[54px] w-full items-center justify-center gap-1 rounded-[6px] bg-black"
            onClick={() => setApplePayOpen(true)}
          >
            <img
              src="/icons/checkout/apple.svg"
              alt=""
              width={20}
              height={20}
              className="brightness-0 invert"
            />
            <span className="text-[23px] leading-none font-semibold text-white">Pay</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={!ready}
            className={cn(
              'flex w-full items-center justify-center rounded-lg border font-semibold text-white',
              ready
                ? 'border-(--color-primary-700) bg-(--color-primary-700) px-[18px] py-2.5 text-md leading-6'
                : 'h-10 cursor-not-allowed border-(--color-primary-200) bg-(--color-primary-200) px-4 text-sm leading-5',
            )}
          >
            {ready
              ? t('checkout.payAmount', { amount: amountWithHryvnia(summary.total) })
              : t('checkout.choosePayment')}
          </button>
        )}
        <p className="text-xs leading-[18px] text-(--color-dark-600)">{t('checkout.paymentHint')}</p>
      </aside>
      <GooglePaySheet
        open={googlePayOpen}
        amount={amountWithHryvnia(summary.total)}
        onClose={() => setGooglePayOpen(false)}
      />
      <ApplePaySheet
        open={applePayOpen}
        amount={amountWithHryvnia(summary.total)}
        onClose={() => setApplePayOpen(false)}
      />
    </div>
  );
}

function SellerMark({ seller }: { seller: CartSeller }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <p className="text-xs leading-[18px] text-(--color-dark-600)">{t('checkout.seller')}</p>
      <span className="inline-flex size-7 overflow-hidden rounded-full">
        <ProductIcon src={portraitFor(seller)} width={28} height={28} />
      </span>
      <p className="text-sm leading-5 font-medium text-(--color-dark-800)">{seller.name}</p>
      {seller.verified ? <ProductIcon src="/icons/checkout/verified.svg" width={16} height={16} /> : null}
    </div>
  );
}

function ReceivingOrder({
  number,
  seller,
  method,
  compact,
  destination,
}: {
  number: number;
  seller: CartSeller;
  method?: DeliveryMethodId;
  compact: boolean;
  destination?: string;
}) {
  const { t } = useTranslation();

  return (
    <div className={cn('flex flex-col', compact ? 'gap-4' : 'gap-5 py-4')}>
      {compact ? (
        <SellerMark seller={seller} />
      ) : (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl leading-[30px] font-medium text-(--color-dark-800)">
            {t('checkout.order', { number })}
          </h3>
          <SellerMark seller={seller} />
        </div>
      )}
      {method === 'pickup' ? (
        <div className="flex flex-col gap-2 rounded-lg bg-(--color-dark-100) p-4 text-sm leading-5">
          <p className="font-medium text-(--color-dark-800)">{t('checkout.pickupFrom', { seller: seller.name })}</p>
          <p className="text-(--color-dark-900)">{t('checkout.pickupAddress')}</p>
          <p className="text-(--color-dark-600)">{t('checkout.pickupInstructions')}</p>
          <p className="font-medium text-(--color-accent-green)">{t('checkout.free')}</p>
        </div>
      ) : compact ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <ProductIcon src="/icons/checkout/radio-checked.svg" width={16} height={16} />
            <ProductIcon src="/icons/checkout/nova-poshta.png" width={20} height={20} />
            <p className="text-sm leading-5 font-semibold text-(--color-dark-800)">{t('checkout.novaPoshta')}</p>
          </div>
          <p className="pl-[60px] text-sm leading-5 text-(--color-dark-600)">
            {destination ?? t('checkout.novaDestination')}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <ProductIcon src="/icons/checkout/nova-poshta.png" width={20} height={20} />
            <p className="text-sm leading-5 font-semibold text-(--color-dark-800)">{t('checkout.novaPoshta')}</p>
          </div>
          <p className="text-sm leading-5 text-(--color-dark-600)">
            {destination ?? t('checkout.novaDestination')}
          </p>
        </>
      )}
    </div>
  );
}

function CardField({
  label,
  value,
  placeholder,
  name,
  autoComplete,
  inputMode,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  name: string;
  autoComplete: string;
  inputMode: 'numeric';
  onChange: (value: string) => void;
}) {
  const id = useId();

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm leading-5 font-medium text-(--color-dark-700)">
        {label}
      </label>
      <input
        id={id}
        name={name}
        autoComplete={autoComplete}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
    </div>
  );
}
