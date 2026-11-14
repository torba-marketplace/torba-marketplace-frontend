'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { mockCartItems } from '@/data/cart-mock';
import {
  upsertCartItem,
  withCartQuantity,
  withCartSelection,
  withoutCartItem,
} from '@/lib/cart-summary';
import { replaceShopIds } from '@/lib/shop-lists';
import type { LocalizedText } from '@/lib/localized';
import type { CartDraft, CartItem, CartSeller } from '@/types/cart';

const STORAGE_KEY = 'torba-cart-items';

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (draft: CartDraft) => void;
  setQuantity: (id: string, quantity: number) => void;
  toggleSelected: (id: string) => void;
  removeItem: (id: string) => void;
  contains: (id: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function isLocalized(value: unknown): value is LocalizedText {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;

  return typeof record.uk === 'string' && typeof record.en === 'string';
}

function isSeller(value: unknown): value is CartSeller {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const seller = value as CartSeller;

  return typeof seller.id === 'string' && typeof seller.name === 'string' && isLocalized(seller.dispatch);
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as CartItem;

  return (
    typeof item.id === 'string' &&
    isLocalized(item.title) &&
    typeof item.price === 'number' &&
    typeof item.available === 'boolean' &&
    typeof item.quantity === 'number' &&
    typeof item.selected === 'boolean' &&
    isSeller(item.seller)
  );
}

export function readStoredCart(): CartItem[] | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (raw === null) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isCartItem).map((item) => ({
      ...item,
      quantity: Math.max(1, Math.floor(item.quantity)),
      selected: item.available ? item.selected : false,
    }));
  } catch {
    return [];
  }
}

function writeStoredCart(items: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  replaceShopIds(
    'cart',
    items.map((item) => item.id),
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);
  const pendingRef = useRef<CartDraft[]>([]);

  useEffect(() => {
    const stored = readStoredCart();
    const base = stored ?? mockCartItems();
    const next = pendingRef.current.splice(0).reduce(upsertCartItem, base);

    readyRef.current = true;
    setItems(next);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    writeStoredCart(items);
  }, [items, ready]);

  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const addToCart = useCallback((draft: CartDraft) => {
    setIsOpen(true);

    if (!readyRef.current) {
      pendingRef.current.push(draft);
      return;
    }

    setItems((current) => upsertCartItem(current, draft));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) => withCartQuantity(current, id, quantity));
  }, []);

  const toggleSelected = useCallback((id: string) => {
    setItems((current) => withCartSelection(current, id));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => withoutCartItem(current, id));
  }, []);

  const contains = useCallback((id: string) => items.some((item) => item.id === id), [items]);

  const value = useMemo(
    () => ({
      items,
      isOpen,
      openCart,
      closeCart,
      addToCart,
      setQuantity,
      toggleSelected,
      removeItem,
      contains,
    }),
    [addToCart, closeCart, contains, isOpen, items, openCart, removeItem, setQuantity, toggleSelected],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}
