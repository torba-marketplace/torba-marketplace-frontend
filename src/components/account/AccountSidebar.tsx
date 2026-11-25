'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

import { AccountPanel } from '@/components/account/AccountPanel';
import { useAccountPanel } from '@/lib/account-panel';
import { cn } from '@/lib/cn';

const EXIT_MS = 320;

export function AccountSidebar() {
  const { t } = useTranslation();
  const { isOpen, closeAccount } = useAccountPanel();
  const [rendered, setRendered] = useState(false);
  const [shown, setShown] = useState(false);

  if (isOpen && !rendered) {
    setRendered(true);
  } else if (!isOpen && shown) {
    setShown(false);
  }

  useEffect(() => {
    if (!rendered || !isOpen) {
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
  }, [isOpen, rendered]);

  useEffect(() => {
    if (isOpen || !rendered) {
      return;
    }

    const timer = window.setTimeout(() => setRendered(false), EXIT_MS);

    return () => window.clearTimeout(timer);
  }, [isOpen, rendered]);

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
    if (!isOpen || !rendered) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeAccount();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.getElementById('account-close')?.focus();

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeAccount, isOpen, rendered]);

  if (!rendered) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label={t('account.close')}
        className={cn(
          'absolute inset-0 bg-[rgba(26,31,30,0.48)] transition-opacity duration-300 motion-reduce:transition-none',
          shown ? 'opacity-100' : 'opacity-0',
        )}
        onClick={closeAccount}
      />
      <div
        id="account-sidebar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-title"
        className={cn(
          'absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-[-12px_0_32px_rgba(26,31,30,0.08)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:w-[485px]',
          shown ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <AccountPanel onClose={closeAccount} />
      </div>
    </div>,
    document.body,
  );
}
