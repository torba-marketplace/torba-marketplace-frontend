'use client';

import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/cn';

const EXIT_MS = 280;

type ApplePaySheetProps = {
  open: boolean;
  amount: string;
  onClose: () => void;
};

export function ApplePaySheet({ open, amount, onClose }: ApplePaySheetProps) {
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
    document.getElementById('apay-cancel')?.focus();

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, open, rendered]);

  if (!rendered) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-4 py-6">
      <button
        type="button"
        aria-label={t('checkout.apayClose')}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'relative flex w-full max-w-[460px] flex-col gap-5 rounded-[36px] border-[0.5px] border-[#ababab] bg-[rgba(237,237,237,0.64)] p-6 shadow-[4px_8px_32px_rgba(0,0,0,0.16)] backdrop-blur-xl transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
          shown ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-[0.98] opacity-0',
        )}
      >
        <div className="flex items-center justify-between">
          <img src="/icons/checkout/apple-pay-logo.svg" alt="" width="53.5871" height="22" />
          <button
            id="apay-cancel"
            type="button"
            className="rounded-full bg-[#dadada] px-4 py-2 text-base leading-5 font-medium tracking-[-0.05em] text-black"
            onClick={onClose}
          >
            {t('checkout.apayCancel')}
          </button>
        </div>

        <div className="flex gap-[15px] rounded-2xl bg-white/95 p-4">
          <span
            className="mt-0.5 h-6 w-[37px] shrink-0 rounded"
            style={{
              backgroundImage: 'linear-gradient(66deg, rgb(119, 22, 74) 0%, rgb(40, 23, 74) 93%)',
            }}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="text-[15px] leading-5 font-medium tracking-[-0.04em] text-black">
              {t('checkout.apayCardName')}
            </p>
            <div className="flex flex-col gap-1.5 text-[13px] leading-4 tracking-[-0.04em] text-[#717171]">
              <p>{t('checkout.apayCardNumber')}</p>
              <p>{t('checkout.apayCardHolder')}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <p id={titleId} className="text-xs leading-4 font-medium tracking-[-0.04em] text-[#717171]">
              {t('checkout.apayTo')}
            </p>
            <p className="text-[32px] leading-none text-black">{amount}</p>
          </div>
          <div className="flex flex-col items-center gap-3.5">
            <img
              src="/icons/checkout/apple-pay-spinner.svg"
              alt=""
              width={41}
              height={41}
              className="animate-spin motion-reduce:animate-none"
            />
            <p className="text-lg leading-6 font-medium tracking-[-0.04em] text-black">
              {t('checkout.apayProcessing')}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
