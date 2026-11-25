'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type AccountPanelValue = {
  isOpen: boolean;
  openAccount: () => void;
  closeAccount: () => void;
};

const AccountPanelContext = createContext<AccountPanelValue | null>(null);

export function AccountPanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openAccount = useCallback(() => setIsOpen(true), []);
  const closeAccount = useCallback(() => setIsOpen(false), []);
  const value = useMemo(
    () => ({ isOpen, openAccount, closeAccount }),
    [closeAccount, isOpen, openAccount],
  );

  return (
    <AccountPanelContext.Provider value={value}>{children}</AccountPanelContext.Provider>
  );
}

export function useAccountPanel() {
  const value = useContext(AccountPanelContext);

  if (!value) {
    throw new Error('useAccountPanel must be used within AccountPanelProvider');
  }

  return value;
}
