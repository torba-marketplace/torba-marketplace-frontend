'use client';

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ChevronLeft, Eye, EyeOff, Mail01 } from '@untitledui/icons';
import { useTranslation } from 'react-i18next';

import { ProductIcon } from '@/components/product/ProductIcon';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/cn';

type AccountPanelProps = {
  onClose: () => void;
};

type View = 'login' | 'reset' | 'register' | 'checkEmail' | 'registered';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

export function AccountPanel({ onClose }: AccountPanelProps) {
  const { t } = useTranslation();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();
  const resetEmailId = useId();
  const firstNameId = useId();
  const lastNameId = useId();
  const registerEmailId = useId();
  const registerPasswordId = useId();
  const confirmPasswordId = useId();
  const termsId = useId();
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const emailReady = isEmail(email);
  const loginReady = emailReady && password.trim().length > 0;
  const registerReady =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    emailReady &&
    registerPassword.trim().length > 0 &&
    registerPassword === confirmPassword &&
    acceptedTerms;

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 0 });

    if (view === 'reset' || view === 'checkEmail') {
      document.getElementById('account-back')?.focus();
    }
  }, [view]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function onResetSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (emailReady) {
      setView('checkEmail');
    }
  }

  function onRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (registerReady) {
      setView('registered');
    }
  }

  return (
    <div ref={scrollerRef} className="relative h-full min-h-0 overflow-y-auto bg-white px-6 py-6 sm:px-10">
      <button
        type="button"
        id="account-close"
        className="absolute top-5 right-5 z-10 inline-flex size-8 items-center justify-center rounded-md text-(--color-dark-800) outline-none hover:bg-(--color-dark-100) focus-visible:ring-2 focus-visible:ring-(--color-brand)/40"
        aria-label={t('account.close')}
        onClick={onClose}
      >
        <ProductIcon src="/icons/cart/close.svg" width={24} height={24} />
      </button>

      {view === 'login' ? (
        <div className="mx-auto flex w-full max-w-[360px] flex-col items-center pt-10">
          <Logo />
          <h2 id="account-title" className="mt-4 text-xl leading-[30px] font-medium text-(--color-dark-800)">
            {t('account.title')}
          </h2>

          <form className="mt-6 flex w-full flex-col gap-4" onSubmit={onSubmit}>
            <Field label={t('account.email')} htmlFor={emailId}>
              <input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                placeholder={t('account.emailPlaceholder')}
                onChange={(event) => setEmail(event.target.value)}
                className={fieldClassName}
              />
            </Field>
            <Field label={t('account.password')} htmlFor={passwordId}>
              <PasswordInput
                id={passwordId}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={setPassword}
              />
            </Field>

            <div className="flex items-center justify-between gap-3">
              <label htmlFor={rememberId} className="inline-flex items-center gap-2 text-sm leading-5 text-(--color-dark-700)">
                <input
                  id={rememberId}
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="size-4 rounded border-(--color-dark-300) accent-(--color-primary-700)"
                />
                {t('account.remember')}
              </label>
              <button
                type="button"
                className="text-sm leading-5 text-(--color-dark-700) underline underline-offset-2"
                onClick={() => setView('reset')}
              >
                {t('account.forgot')}
              </button>
            </div>

            <ContinueButton enabled={loginReady} label={t('account.continue')} />
          </form>

          <SocialRow />
          <AccountFooter prompt={t('account.newHere')} action={t('account.create')} onAction={() => setView('register')} />
        </div>
      ) : null}

      {view === 'reset' ? (
        <div>
          <BackButton label={t('account.back')} onClick={() => setView('login')} />
          <div className="mx-auto flex w-full max-w-[360px] flex-col items-center pt-10">
            <Logo />
            <h2 id="account-title" className="mt-4 text-center text-xl leading-[30px] font-medium text-(--color-dark-800)">
              {t('account.resetTitle')}
            </h2>
            <p className="mt-2 max-w-[260px] text-center text-sm leading-5 text-(--color-dark-600)">{t('account.resetHint')}</p>

            <form className="mt-6 flex w-full flex-col gap-4" onSubmit={onResetSubmit}>
              <Field label={t('account.email')} htmlFor={resetEmailId}>
                <input
                  id={resetEmailId}
                  name="reset-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  placeholder={t('account.emailPlaceholder')}
                  onChange={(event) => setEmail(event.target.value)}
                  className={fieldClassName}
                />
              </Field>

              <ContinueButton enabled={emailReady} label={t('account.continue')} />
            </form>

            <AccountFooter prompt={t('account.newHere')} action={t('account.create')} onAction={() => setView('register')} />
          </div>
        </div>
      ) : null}

      {view === 'register' ? (
        <div className="mx-auto flex w-full max-w-[360px] flex-col items-center pt-10">
          <Logo />
          <h2 id="account-title" className="mt-4 text-xl leading-[30px] font-medium text-(--color-dark-800)">
            {t('account.registerTitle')}
          </h2>

          <form className="mt-6 flex w-full flex-col gap-4" onSubmit={onRegisterSubmit}>
            <Field label={t('account.firstName')} htmlFor={firstNameId} required>
              <input
                id={firstNameId}
                name="given-name"
                autoComplete="given-name"
                required
                value={firstName}
                placeholder={t('account.firstName')}
                onChange={(event) => setFirstName(event.target.value)}
                className={fieldClassName}
              />
            </Field>
            <Field label={t('account.lastName')} htmlFor={lastNameId} required>
              <input
                id={lastNameId}
                name="family-name"
                autoComplete="family-name"
                required
                value={lastName}
                placeholder={t('account.lastName')}
                onChange={(event) => setLastName(event.target.value)}
                className={fieldClassName}
              />
            </Field>
            <Field label={t('account.email')} htmlFor={registerEmailId} required>
              <input
                id={registerEmailId}
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                placeholder={t('account.emailPlaceholder')}
                onChange={(event) => setEmail(event.target.value)}
                className={fieldClassName}
              />
            </Field>
            <Field label={t('account.password')} htmlFor={registerPasswordId} required>
              <PasswordInput
                id={registerPasswordId}
                name="new-password"
                autoComplete="new-password"
                required
                value={registerPassword}
                onChange={setRegisterPassword}
              />
            </Field>
            <Field label={t('account.confirmPassword')} htmlFor={confirmPasswordId} required>
              <PasswordInput
                id={confirmPasswordId}
                name="confirm-password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </Field>

            <label htmlFor={termsId} className="inline-flex items-start gap-2 text-sm leading-5 text-(--color-dark-700)">
              <input
                id={termsId}
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-0.5 size-4 rounded border-(--color-dark-300) accent-(--color-primary-700)"
              />
              {t('account.terms')}
            </label>

            <ContinueButton enabled={registerReady} label={t('account.register')} />
          </form>

          <SocialRow />
          <AccountFooter prompt={t('account.haveAccount')} action={t('account.signIn')} onAction={() => setView('login')} />
        </div>
      ) : null}

      {view === 'registered' ? (
        <div className="mx-auto flex w-full max-w-[360px] flex-col items-center pt-10">
          <Logo />
          <h2 id="account-title" className="mt-4 text-center text-xl leading-[30px] font-medium text-(--color-dark-800)">
            {t('account.createdTitle')}
          </h2>
          <button
            type="button"
            className="mt-6 flex h-11 w-full items-center justify-center rounded-lg bg-(--color-primary-700) text-sm leading-5 font-semibold text-white hover:bg-(--color-primary-800)"
            onClick={onClose}
          >
            {t('account.goToCabinet')}
          </button>
        </div>
      ) : null}

      {view === 'checkEmail' ? (
        <div>
          <BackButton label={t('account.back')} onClick={() => setView('reset')} />
          <div className="mx-auto flex w-full flex-col items-center pt-16 text-center">
            <Mail01 className="size-8 text-(--color-dark-800)" aria-hidden />
            <h2 id="account-title" className="mt-6 text-xl leading-[30px] font-medium text-(--color-dark-800)">
              {t('account.checkEmailTitle')}
            </h2>
            <p className="mt-3 max-w-[340px] text-sm leading-5 text-(--color-dark-600)">{t('account.checkEmailBody')}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const fieldClassName =
  'h-11 w-full rounded-lg border border-(--color-dark-300) bg-white px-3.5 text-md leading-6 text-(--color-dark-900) shadow-xs outline-none placeholder:text-(--color-dark-500) focus:border-(--color-primary-700) focus:ring-2 focus:ring-(--color-brand)/30';

function PasswordInput({
  id,
  name,
  autoComplete,
  required = false,
  value,
  onChange,
}: {
  id: string;
  name: string;
  autoComplete: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(fieldClassName, 'pr-11')}
      />
      <button
        type="button"
        className="absolute top-1/2 right-3 inline-flex size-5 -translate-y-1/2 items-center justify-center text-(--color-dark-500) outline-none hover:text-(--color-dark-800) focus-visible:text-(--color-dark-800)"
        aria-label={visible ? t('account.hidePassword') : t('account.showPassword')}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
      </button>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  required = false,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={htmlFor}>
      <span className="text-sm leading-5 font-medium text-(--color-dark-700)">
        {label}
        {required ? <span className="text-(--color-red-500)"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

function ContinueButton({ enabled, label }: { enabled: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={!enabled}
      className={cn(
        'mt-1 flex h-11 w-full items-center justify-center rounded-lg text-sm leading-5 font-semibold',
        enabled
          ? 'bg-(--color-primary-700) text-white hover:bg-(--color-primary-800)'
          : 'cursor-not-allowed bg-(--color-primary-200) text-(--color-primary-700)',
      )}
    >
      {label}
    </button>
  );
}

function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      id="account-back"
      className="absolute top-5 left-5 inline-flex size-8 items-center justify-center rounded-md text-(--color-dark-800) outline-none hover:bg-(--color-dark-100) focus-visible:ring-2 focus-visible:ring-(--color-brand)/40"
      aria-label={label}
      onClick={onClick}
    >
      <ChevronLeft className="size-6" />
    </button>
  );
}

function SocialRow() {
  const { t } = useTranslation();

  return (
    <div className="relative mt-5 flex w-full items-center justify-center">
      <span className="absolute inset-x-0 top-1/2 h-px bg-(--color-dark-150)" />
      <span className="relative flex items-center gap-3 bg-white px-3">
        <SocialMark icon="/icons/checkout/google.svg" label={t('account.google')} />
        <SocialMark icon="/icons/checkout/apple.svg" label={t('account.apple')} />
      </span>
    </div>
  );
}

function AccountFooter({ prompt, action, onAction }: { prompt: string; action: string; onAction: () => void }) {
  const { t } = useTranslation();

  return (
    <>
      <p className="mt-5 text-center text-sm leading-5 text-(--color-dark-700)">
        {prompt}{' '}
        <button type="button" className="font-semibold text-(--color-primary-700)" onClick={onAction}>
          {action}
        </button>
      </p>

      <div className="mt-8 flex w-full items-center justify-between gap-3">
        <p className="text-sm leading-5 text-(--color-dark-700)">{t('account.forSellers')}</p>
        <button
          type="button"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-(--color-primary-100) px-3 text-sm leading-5 font-semibold text-(--color-primary-700)"
        >
          <ProductIcon src="/icons/Shopping_Bag_01.svg" width={18} height={18} />
          {t('account.sellerCabinet')}
        </button>
      </div>
    </>
  );
}

function SocialMark({ icon, label }: { icon: string; label: string }) {
  return (
    <button type="button" aria-label={label} className="inline-flex size-8 items-center justify-center rounded-full bg-white">
      <ProductIcon src={icon} width={20} height={20} />
    </button>
  );
}
