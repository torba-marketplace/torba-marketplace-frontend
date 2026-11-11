'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

const CART_KEY = 'torba-cart';
const FAVORITES_KEY = 'torba-favorites';
const RECENT_KEY = 'torba-recent-products';
const CHANGE_EVENT = 'torba-shop-lists';

type ShopFlag = 'cart' | 'favorites';

const flagKey: Record<ShopFlag, string> = {
  cart: CART_KEY,
  favorites: FAVORITES_KEY,
};

function readIds(key: string): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? '[]') as unknown;

    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: string[]) {
  window.localStorage.setItem(key, JSON.stringify(ids));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useShopFlag(flag: ShopFlag, id: string) {
  const key = flagKey[flag];
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setEnabled(readIds(key).includes(id));

    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [id, key]);

  function toggle() {
    const ids = readIds(key);
    writeIds(
      key,
      ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id],
    );
  }

  return [enabled, toggle] as const;
}

function subscribeShopLists(onStoreChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  window.addEventListener('storage', onStoreChange);

  return () => {
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

function readRecentSnapshot() {
  return window.localStorage.getItem(RECENT_KEY) ?? '';
}

export function useRecentProductIds(): string[] {
  const raw = useSyncExternalStore(subscribeShopLists, readRecentSnapshot, () => '');

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function rememberProductView(id: string) {
  const previous = readIds(RECENT_KEY).filter((item) => item !== id);
  const next = [id, ...previous].slice(0, 12);

  if (readIds(RECENT_KEY).join('\0') === next.join('\0')) {
    return;
  }

  writeIds(RECENT_KEY, next);
}
