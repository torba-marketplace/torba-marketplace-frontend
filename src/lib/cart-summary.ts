import type { CartDraft, CartItem, CartSeller } from '@/types/cart';

export type CountForm = 'one' | 'few' | 'many';

export type CartSummary = {
  totalQuantity: number;
  payableQuantity: number;
  unavailableQuantity: number;
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
};

export function countForm(count: number): CountForm {
  const abs = Math.abs(Math.trunc(count));
  const mod100 = abs % 100;
  const mod10 = abs % 10;

  if (mod100 > 10 && mod100 < 20) {
    return 'many';
  }

  if (mod10 === 1) {
    return 'one';
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return 'few';
  }

  return 'many';
}

export function cartMoney(amount: number): string {
  const digits = Math.abs(Math.round(amount)).toString();
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');

  return `₴${grouped}`;
}

export function summarizeCart(items: CartItem[]): CartSummary {
  let totalQuantity = 0;
  let payableQuantity = 0;
  let unavailableQuantity = 0;
  let subtotal = 0;
  let total = 0;

  for (const item of items) {
    totalQuantity += item.quantity;

    if (!item.available) {
      unavailableQuantity += item.quantity;
      continue;
    }

    if (!item.selected) {
      continue;
    }

    payableQuantity += item.quantity;
    subtotal += (item.oldPrice ?? item.price) * item.quantity;
    total += item.price * item.quantity;
  }

  return {
    totalQuantity,
    payableQuantity,
    unavailableQuantity,
    subtotal,
    discount: Math.max(0, subtotal - total),
    delivery: 0,
    total,
  };
}

export type CartSellerGroup = {
  seller: CartSeller;
  items: CartItem[];
};

export function groupCartBySeller(items: CartItem[]): CartSellerGroup[] {
  const groups: CartSellerGroup[] = [];

  for (const item of items) {
    const current = groups.find((group) => group.seller.id === item.seller.id);

    if (current) {
      current.items.push(item);
      continue;
    }

    groups.push({ seller: item.seller, items: [item] });
  }

  return groups;
}

export function upsertCartItem(items: CartItem[], draft: CartDraft): CartItem[] {
  if (items.some((item) => item.id === draft.id)) {
    return items;
  }

  return [
    ...items,
    {
      ...draft,
      quantity: 1,
      selected: draft.available,
    },
  ];
}

export function withCartQuantity(items: CartItem[], id: string, quantity: number): CartItem[] {
  const next = Math.max(1, Math.floor(quantity));

  return items.map((item) => (item.id === id ? { ...item, quantity: next } : item));
}

export function withCartSelection(items: CartItem[], id: string): CartItem[] {
  return items.map((item) =>
    item.id === id && item.available ? { ...item, selected: !item.selected } : item,
  );
}

export function withoutCartItem(items: CartItem[], id: string): CartItem[] {
  return items.filter((item) => item.id !== id);
}
