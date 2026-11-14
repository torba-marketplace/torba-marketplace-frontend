import type { LocalizedText } from '@/lib/localized';

export type CartSeller = {
  id: string;
  name: string;
  avatarUrl?: string;
  verified: boolean;
  dispatch: LocalizedText;
};

export type CartDraft = {
  id: string;
  title: LocalizedText;
  imageUrl?: string;
  price: number;
  oldPrice?: number;
  variant?: LocalizedText;
  available: boolean;
  seller: CartSeller;
};

export type CartItem = CartDraft & {
  quantity: number;
  selected: boolean;
};
