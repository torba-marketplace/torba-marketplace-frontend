'use client';

import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { ProductIcon } from '@/components/product/ProductIcon';
import { cn } from '@/lib/cn';

const EXIT_MS = 280;

type GooglePaySheetProps = {
  open: boolean;
  amount: string;
  onClose: () => void;
};

export function GooglePaySheet({ open, amount, onClose }: GooglePaySheetProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const [rendered, setRendered] = useState(false);
  const [shown, setShown] = useState(false);

  if (open && !rendered) {
    setRendered(true);
  } else if (!open && shown) {
    setShown(false);
  }

  useEffect(() => {
    if (!rendered || !open) {
      return;
    }

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setShown(true));
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [open, rendered]);

  useEffect(() => {
    if (open || !rendered) {
      return;
    }

    const timer = window.setTimeout(() => setRendered(false), EXIT_MS);

    return () => window.clearTimeout(timer);
  }, [open, rendered]);

  useEffect(() => {
    if (!rendered) {
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [rendered]);

  useEffect(() => {
    if (!open || !rendered) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.getElementById('gpay-close')?.focus();

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, open, rendered]);

  if (!rendered) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto px-4 pt-4 pb-6 sm:pt-24">
      <button
        type="button"
        aria-label={t('checkout.gpayClose')}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'relative mb-6 flex w-full max-w-[608px] flex-col rounded-xl border border-[#202124] bg-white shadow-[0_4px_2px_rgba(0,0,0,0.25)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:min-h-[550px]',
          shown ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-[0.98] opacity-0',
        )}
      >
        <div className="relative flex items-center justify-between border-b-2 border-[#dadce0] p-4">
          <ProductIcon src="/icons/checkout/gpay-logo-sm.svg" width={32} height={15} />
          <p className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-xs leading-[18px] text-[#3c4043]">
            {t('checkout.gpayHost')}
          </p>
          <button
            id="gpay-close"
            type="button"
            aria-label={t('checkout.gpayClose')}
            className="flex size-5 items-center justify-center"
            onClick={onClose}
          >
            <ProductIcon src="/icons/checkout/gpay-close.svg" width={20} height={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 pt-6">
          <div className="flex items-center justify-between">
            <ProductIcon src="/icons/checkout/gpay-logo.svg" width={60} height={28} />
            <span className="flex size-8 items-center justify-center rounded-full bg-[#5735ab] text-xs leading-[18px] font-medium text-white">
              {t('checkout.gpayAccount')}
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-[#e8f0fd] px-3 py-4">
            <img
              src="/image/checkout/gpay-card.png"
              alt=""
              width={60}
              height={38}
              className="rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-md leading-[18px] font-medium text-[#3c4043]">{t('checkout.gpayCardName')}</p>
              <p className="text-sm leading-5 text-[#3c4043]">{t('checkout.gpayCardNumber')}</p>
            </div>
            <ProductIcon src="/icons/checkout/gpay-chevron.svg" width={24} height={24} />
          </div>

          <div className="flex items-center justify-between gap-4">
            <p id={titleId} className="text-sm leading-5 font-medium text-[#3c4043]">
              {t('checkout.gpayMerchant')}
            </p>
            <p className="text-[28px] leading-8 font-normal whitespace-nowrap text-[#3c4043]">{amount}</p>
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center rounded-[20px] bg-[#1b66c9] px-2.5 py-2.5 text-sm leading-5 font-medium text-white"
            onClick={onClose}
          >
            {t('checkout.gpayContinue')}
          </button>

          <div className="flex items-center justify-center gap-1.5">
            <img src="/icons/checkout/gpay-lock.png" alt="" width={14} height={14} />
            <p className="text-[10px] leading-[15px] text-[#5f6368]">{t('checkout.gpayEncrypted')}</p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
