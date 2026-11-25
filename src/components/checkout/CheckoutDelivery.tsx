'use client';

import { ChevronDown } from '@untitledui/icons';
import { useId, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { ProductIcon } from '@/components/product/ProductIcon';
import { Button } from '@/components/ui/Button';
import { countForm, groupCartBySeller, summarizeCart } from '@/lib/cart-summary';
import { useCart } from '@/lib/cart-store';
import { cn } from '@/lib/cn';
import type { CartSeller } from '@/types/cart';

import { formatUaPhone, isOrderPhone } from './phone';

export type DeliveryMethodId = 'nova-poshta' | 'pickup';

export type DeliveryDestination = {
  city: string;
  branch: string;
};

export type DeliveryDraft = {
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  methods: Record<string, DeliveryMethodId>;
  destinations: Record<string, DeliveryDestination>;
};

const novaCities = ['Київ, Київська область'];
const novaBranches = ['№ 1, вул. Пирогівський шлях, 135'];

type DeliveryChoice = {
  id: DeliveryMethodId;
  icon: string;
  width: number;
  height: number;
  titleKey: 'checkout.novaPoshta' | 'checkout.pickup';
  detailKey: 'checkout.carrierRates' | 'checkout.pickupPlace';
};

const novaPoshta: DeliveryChoice = {
  id: 'nova-poshta',
  icon: '/icons/checkout/nova-poshta.png',
  width: 20,
  height: 20,
  titleKey: 'checkout.novaPoshta',
  detailKey: 'checkout.carrierRates',
};

const pickup: DeliveryChoice = {
  id: 'pickup',
  icon: '/icons/checkout/pickup.svg',
  width: 20,
  height: 20,
  titleKey: 'checkout.pickup',
  detailKey: 'checkout.pickupPlace',
};

function choicesFor(sellerId: string) {
  if (sellerId === 'non-di') {
    return [novaPoshta, pickup];
  }

  return [novaPoshta];
}

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

const fieldClass =
  'h-11 w-full rounded-lg border bg-white px-3.5 text-md leading-6 text-(--color-dark-900) shadow-xs outline-none placeholder:text-(--color-dark-500) focus:ring-2 focus:ring-(--color-brand)/30';

type CheckoutDeliveryProps = {
  phone: string;
  initial?: DeliveryDraft | null;
  onPay: (draft: DeliveryDraft) => void;
};

export function CheckoutDelivery({ phone, initial, onPay }: CheckoutDeliveryProps) {
  const { t } = useTranslation();
  const { items, openCart } = useCart();
  const summary = summarizeCart(items);
  const orders = groupCartBySeller(items.filter((item) => item.available && item.selected));
  const formId = 'checkout-delivery';
  const [recipientPhone, setRecipientPhone] = useState(() => initial?.phone || formatUaPhone(phone));
  const [email, setEmail] = useState(() => initial?.email ?? '');
  const [firstName, setFirstName] = useState(() => initial?.firstName ?? '');
  const [lastName, setLastName] = useState(() => initial?.lastName ?? '');
  const [methods, setMethods] = useState<Record<string, DeliveryMethodId>>(() => initial?.methods ?? {});
  const [destinations, setDestinations] = useState<Record<string, DeliveryDestination>>(
    () => initial?.destinations ?? {},
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const itemsKey = countForm(summary.payableQuantity);
  const deliveryLabel = summary.delivery === 0 ? t('checkout.free') : amountWithHryvnia(summary.delivery);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Record<string, string> = {};

    if (!isOrderPhone(recipientPhone)) {
      next.phone = t('checkout.phoneInvalid');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = t('checkout.emailInvalid');
    }

    if (!firstName.trim()) {
      next.firstName = t('checkout.fieldRequired');
    }

    if (!lastName.trim()) {
      next.lastName = t('checkout.fieldRequired');
    }

    for (const order of orders) {
      const method = methods[order.seller.id];

      if (!method) {
        next[order.seller.id] = t('checkout.chooseDelivery');
        continue;
      }

      if (method === 'nova-poshta' && !destinations[order.seller.id]?.branch) {
        next[order.seller.id] = t('checkout.chooseDelivery');
      }
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      return;
    }

    onPay({
      phone: recipientPhone,
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      methods,
      destinations,
    });
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="flex w-full flex-col items-start gap-4 md:gap-8 xl:flex-row xl:gap-12">
      <div className="flex w-full min-w-0 flex-1 flex-col gap-4 md:gap-6">
        <form id={formId} className="flex flex-col gap-4 rounded-2xl bg-white px-4 py-4 sm:px-6 md:gap-5" onSubmit={onSubmit} noValidate>
          <h2 className="text-xl leading-[30px] font-medium text-(--color-dark-800)">{t('checkout.recipient')}</h2>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <Field
              label={t('checkout.phoneLabel')}
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={recipientPhone}
              error={errors.phone}
              onChange={(value) => {
                setRecipientPhone(value);
                setErrors((current) => ({ ...current, phone: '' }));
              }}
            />
            <Field
              label={t('checkout.emailLabel')}
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              placeholder={t('checkout.emailPlaceholder')}
              error={errors.email}
              onChange={(value) => {
                setEmail(value);
                setErrors((current) => ({ ...current, email: '' }));
              }}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label={t('checkout.firstName')}
              name="given-name"
              autoComplete="given-name"
              required
              value={firstName}
              placeholder={t('checkout.firstName')}
              error={errors.firstName}
              onChange={(value) => {
                setFirstName(value);
                setErrors((current) => ({ ...current, firstName: '' }));
              }}
            />
            <Field
              label={t('checkout.lastName')}
              name="family-name"
              autoComplete="family-name"
              required
              value={lastName}
              placeholder={t('checkout.lastName')}
              error={errors.lastName}
              onChange={(value) => {
                setLastName(value);
                setErrors((current) => ({ ...current, lastName: '' }));
              }}
            />
          </div>
          <p className="text-xs leading-[18px] text-(--color-dark-600)">{t('checkout.demoNote')}</p>
        </form>

        {orders.length > 1 ? (
          <div className="flex items-center gap-3 rounded-lg border border-(--color-primary-400) bg-white px-4 py-3">
            <ProductIcon src="/icons/checkout/info.svg" width={24} height={24} />
            <p className="text-sm leading-5 font-semibold text-(--color-dark-900)">{t('checkout.splitNotice')}</p>
          </div>
        ) : null}

        {orders.map((order, index) => (
          <section key={order.seller.id} className="flex flex-col gap-5 rounded-2xl bg-white px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl leading-[30px] font-medium text-(--color-dark-800)">
                {t('checkout.order', { number: index + 1 })}
              </h2>
              <div className="flex items-center gap-2">
                <p className="text-xs leading-[18px] text-(--color-dark-600)">{t('checkout.seller')}</p>
                <span className="inline-flex size-7 overflow-hidden rounded-full">
                  <ProductIcon src={portraitFor(order.seller)} width={28} height={28} />
                </span>
                <p className="text-sm leading-5 font-medium text-(--color-dark-800)">{order.seller.name}</p>
                {order.seller.verified ? (
                  <ProductIcon src="/icons/checkout/verified.svg" width={16} height={16} />
                ) : null}
              </div>
            </div>
            <div role="radiogroup" aria-label={t('checkout.order', { number: index + 1 })} className="flex flex-col gap-5">
              {choicesFor(order.seller.id).map((choice) => {
                const selected = methods[order.seller.id] === choice.id;
                const destination = destinations[order.seller.id];

                return (
                  <div key={choice.id} className="flex flex-col gap-4">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className="flex items-center gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand)/30"
                      onClick={() => {
                        setMethods((current) => ({ ...current, [order.seller.id]: choice.id }));
                        if (choice.id === 'nova-poshta') {
                          setDestinations((current) => ({
                            ...current,
                            [order.seller.id]: current[order.seller.id] ?? {
                              city: novaCities[0],
                              branch: novaBranches[0],
                            },
                          }));
                        }
                        setErrors((current) => ({ ...current, [order.seller.id]: '' }));
                      }}
                    >
                      <span
                        className={cn(
                          'flex size-4 shrink-0 items-center justify-center rounded-full border bg-white',
                          selected ? 'border-(--color-primary-700)' : 'border-(--color-dark-200)',
                        )}
                      >
                        {selected ? <span className="size-2 rounded-full bg-(--color-primary-700)" /> : null}
                      </span>
                      <ProductIcon src={choice.icon} width={choice.width} height={choice.height} />
                      <span className="min-w-0">
                        <span className="block text-sm leading-5 font-semibold text-(--color-dark-800)">
                          {t(choice.titleKey)}
                        </span>
                        <span className="block text-xs leading-[18px] font-normal text-(--color-dark-600)">
                          {t(choice.detailKey)}
                        </span>
                      </span>
                    </button>
                    {selected && choice.id === 'nova-poshta' ? (
                      <div className="flex flex-col gap-4">
                        <ChoiceSelect
                          label={t('checkout.city')}
                          value={destination?.city ?? novaCities[0]}
                          options={novaCities}
                          onChange={(city) =>
                            setDestinations((current) => ({
                              ...current,
                              [order.seller.id]: {
                                city,
                                branch: current[order.seller.id]?.branch ?? novaBranches[0],
                              },
                            }))
                          }
                        />
                        <ChoiceSelect
                          label={t('checkout.branch')}
                          value={destination?.branch ?? novaBranches[0]}
                          options={novaBranches}
                          onChange={(branch) =>
                            setDestinations((current) => ({
                              ...current,
                              [order.seller.id]: {
                                city: current[order.seller.id]?.city ?? novaCities[0],
                                branch,
                              },
                            }))
                          }
                        />
                        <p className="text-sm leading-5 font-medium text-(--color-accent-green)">
                          {t('checkout.freeFrom')}
                        </p>
                      </div>
                    ) : null}
                    {selected && choice.id === 'pickup' ? (
                      <div className="flex flex-col gap-2 rounded-lg bg-(--color-dark-100) p-4 text-sm leading-5">
                        <p className="font-medium text-(--color-dark-800)">
                          {t('checkout.pickupFrom', { seller: order.seller.name })}
                        </p>
                        <p className="text-(--color-dark-900)">{t('checkout.pickupAddress')}</p>
                        <p className="text-(--color-dark-600)">{t('checkout.pickupInstructions')}</p>
                        <p className="font-medium text-(--color-accent-green)">{t('checkout.free')}</p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {errors[order.seller.id] ? (
              <p className="text-sm leading-5 text-(--color-red-600)">{errors[order.seller.id]}</p>
            ) : null}
          </section>
        ))}
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
          <p className="font-medium whitespace-nowrap text-(--color-dark-900)">
            {amountWithHryvnia(summary.total)}
          </p>
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
        <Button type="submit" form={formId} size="lg" className="w-full border border-(--color-primary-700)">
          {t('checkout.pay')}
        </Button>
        <p className="text-xs leading-[18px] text-(--color-dark-600)">{t('checkout.deliveryHint')}</p>
      </aside>
    </div>
  );
}

function ChoiceSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const id = useId();

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm leading-5 font-medium text-(--color-dark-700)">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cn(fieldClass, 'appearance-none pr-10')}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-(--color-dark-500)"
          aria-hidden
        />
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  onChange,
  value,
  placeholder,
  name,
  type = 'text',
  autoComplete,
}: {
  label: string;
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  const id = useId();

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm leading-5 font-medium text-(--color-dark-700)">
        {label}
        {required ? <span className="text-(--color-red-600)"> *</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={value}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          fieldClass,
          error ? 'border-(--color-red-600)' : 'border-(--color-dark-300) focus:border-(--color-primary-700)',
        )}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm leading-5 text-(--color-red-600)">
          {error}
        </p>
      ) : null}
    </div>
  );
}
