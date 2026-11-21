'use client';

import { useId, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { ProductIcon } from '@/components/product/ProductIcon';
import { Button } from '@/components/ui/Button';
import { cartMoney, countForm, summarizeCart } from '@/lib/cart-summary';
import { useCart } from '@/lib/cart-store';
import { cn } from '@/lib/cn';

import { CheckoutDelivery } from './CheckoutDelivery';
import { isOrderPhone } from './phone';

const steps = ['contact', 'delivery', 'payment', 'confirmation'] as const;

type CheckoutStep = (typeof steps)[number];

export function CheckoutPage() {
  const { t } = useTranslation();
  const { items, openCart } = useCart();
  const summary = summarizeCart(items);
  const phoneId = useId();
  const [step, setStep] = useState<CheckoutStep>('contact');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const itemsKey = countForm(summary.payableQuantity);
  const deliveryLabel = summary.delivery === 0 ? t('checkout.free') : cartMoney(summary.delivery);

  function onContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isOrderPhone(phone)) {
      setPhoneError(t('checkout.phoneInvalid'));
      return;
    }

    setPhoneError('');
    setStep('delivery');
    window.scrollTo({ top: 0 });
  }

  function showContact() {
    setStep('contact');
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="relative left-1/2 -mb-20 flex w-screen min-h-full flex-1 -translate-x-1/2 flex-col bg-(--color-primary-100) md:mb-0">
      <div className="catalog-frame checkout-frame flex w-full flex-col gap-8 px-4 pt-8 pb-28 sm:px-6 md:pb-14">
        <header className="flex flex-col gap-6">
          <h1 className="text-display-sm font-medium text-(--color-dark-800)">{t('checkout.title')}</h1>
          <ol aria-label={t('checkout.progress')} className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {steps.map((item, index) => {
              const currentIndex = steps.indexOf(step);
              const current = index === currentIndex;
              const done = index < currentIndex;

              return (
                <li key={item} className="flex items-center gap-2" aria-current={current ? 'step' : undefined}>
                  {done ? (
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-(--color-brand)/40"
                      onClick={showContact}
                    >
                      <StepMarker done={done} current={current} index={index} />
                      <StepLabel done={done} current={current} label={t(`checkout.steps.${item}`)} />
                    </button>
                  ) : (
                    <span className="flex items-center gap-2">
                      <StepMarker done={done} current={current} index={index} />
                      <StepLabel done={done} current={current} label={t(`checkout.steps.${item}`)} />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </header>

        {step === 'delivery' ? (
          <CheckoutDelivery key={phone} phone={phone} />
        ) : (
        <div className="flex w-full flex-col items-start gap-8 xl:flex-row xl:gap-12">
          <section className="flex w-full min-w-0 flex-1 flex-col gap-5 rounded-2xl bg-white px-4 py-4 sm:px-6">
            <h2 className="text-xl leading-[30px] font-medium text-(--color-dark-800)">
              {t('checkout.signInTitle')}
            </h2>
            <div className="flex w-full flex-col items-center gap-4">
              <form className="flex w-full max-w-80 flex-col items-center gap-4" onSubmit={onContinue} noValidate>
                <div className="flex w-full flex-col gap-1.5">
                  <label htmlFor={phoneId} className="text-sm leading-5 font-medium text-(--color-dark-700)">
                    {t('checkout.phoneLabel')}
                  </label>
                  <input
                    id={phoneId}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    placeholder={t('checkout.phonePlaceholder')}
                    aria-invalid={phoneError ? true : undefined}
                    aria-describedby={phoneError ? `${phoneId}-error` : undefined}
                    onChange={(event) => {
                      setPhone(event.target.value);
                      if (phoneError) {
                        setPhoneError('');
                      }
                    }}
                    className={cn(
                      'h-11 w-full rounded-lg border bg-white px-3.5 text-md leading-6 text-(--color-dark-800) shadow-xs outline-none placeholder:text-(--color-dark-500) focus:ring-2 focus:ring-(--color-brand)/30',
                      phoneError
                        ? 'border-(--color-red-600)'
                        : 'border-(--color-dark-300) focus:border-(--color-primary-700)',
                    )}
                  />
                  {phoneError ? (
                    <p id={`${phoneId}-error`} className="text-sm leading-5 text-(--color-red-600)">
                      {phoneError}
                    </p>
                  ) : null}
                </div>
                <Button type="submit" size="lg" className="w-full border border-(--color-primary-700)">
                  {t('checkout.continueGuest')}
                </Button>
                <p className="text-sm leading-5 font-medium text-(--color-dark-500)">{t('checkout.or')}</p>
                <Button hierarchy="link" type="button" className="h-auto font-semibold">
                  {t('checkout.signIn')}
                </Button>
                <SocialSignIn icon="/icons/checkout/google.svg" label={t('checkout.google')} />
                <SocialSignIn icon="/icons/checkout/apple.svg" label={t('checkout.apple')} />
              </form>
              <p className="text-center text-xs leading-[18px] text-(--color-dark-600)">{t('checkout.phoneHint')}</p>
            </div>
          </section>

          <aside className="flex w-full shrink-0 flex-col gap-4 rounded-2xl bg-white p-5 sm:p-7 xl:w-[421px]">
            <div className="flex items-center justify-between gap-3 border-b border-(--color-dark-150) pb-3">
              <h2 className="text-2xl leading-8 font-medium text-(--color-dark-800)">{t('checkout.summaryTitle')}</h2>
              <Button hierarchy="link" type="button" className="h-auto font-semibold" onClick={openCart}>
                {t('checkout.edit')}
              </Button>
            </div>
            <SummaryRow
              label={t(`checkout.itemsAmount.${itemsKey}`, { count: summary.payableQuantity })}
              value={cartMoney(summary.total)}
            />
            <SummaryRow
              label={t('checkout.deliveryCost')}
              value={deliveryLabel}
              valueClassName={summary.delivery === 0 ? 'text-(--color-accent-green)' : undefined}
            />
            <div className="flex items-center justify-between gap-3 border-t border-(--color-dark-150) pt-3">
              <p className="text-md leading-6 font-semibold text-(--color-dark-900)">{t('checkout.total')}</p>
              <p className="text-2xl leading-8 font-semibold text-(--color-dark-900)">{cartMoney(summary.total)}</p>
            </div>
            <p className="text-xs leading-[18px] text-(--color-dark-600)">{t('checkout.summaryHint')}</p>
          </aside>
        </div>
        )}
      </div>
    </div>
  );
}

function StepMarker({ done, current, index }: { done: boolean; current: boolean; index: number }) {
  return (
    <span
      className={cn(
        'inline-flex size-7 items-center justify-center rounded-full text-xs leading-[18px] font-medium',
        done || current ? 'bg-(--color-primary-700) text-white' : 'bg-white text-(--color-dark-600)',
      )}
    >
      {done ? <ProductIcon src="/icons/checkout/step-check.svg" width={16} height={16} /> : index + 1}
    </span>
  );
}

function StepLabel({ done, current, label }: { done: boolean; current: boolean; label: string }) {
  return (
    <span
      className={cn(
        'text-sm leading-5',
        current ? 'font-semibold text-(--color-primary-700)' : done ? 'font-normal text-(--color-primary-700)' : 'font-normal text-(--color-dark-600)',
      )}
    >
      {label}
    </span>
  );
}

function SocialSignIn({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      type="button"
      className="flex h-12 w-full items-center gap-4 rounded-lg border border-(--color-dark-150) px-4 transition-colors outline-none hover:bg-(--color-dark-100) focus-visible:ring-2 focus-visible:ring-(--color-brand)/30"
    >
      <ProductIcon src={icon} width={20} height={20} />
      <span className="flex-1 text-center text-sm leading-5 font-semibold text-(--color-dark-900)">{label}</span>
    </button>
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
      <p className={cn('font-medium whitespace-nowrap text-(--color-dark-900)', valueClassName)}>{value}</p>
    </div>
  );
}
