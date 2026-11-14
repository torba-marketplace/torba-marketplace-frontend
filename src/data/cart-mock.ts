import type { LocalizedText } from '@/lib/localized';
import type { CartItem, CartSeller } from '@/types/cart';

const dispatch: LocalizedText = {
  uk: 'Відправка протягом 3 робочих днів',
  en: 'Ships within 3 business days',
};

export const charge34Seller: CartSeller = {
  id: 'charge34',
  name: 'CHARGE34',
  avatarUrl: '/image/cart/seller-charge34.png',
  verified: true,
  dispatch,
};

export const nonDiSeller: CartSeller = {
  id: 'non-di',
  name: 'Non DI',
  avatarUrl: '/image/cart/seller-nondi.png',
  verified: true,
  dispatch,
};

const sellersByName: Record<string, CartSeller> = {
  CHARGE34: charge34Seller,
  'Non DI': nonDiSeller,
  'Non Di': nonDiSeller,
};

export function sellerFromName(name: string): CartSeller {
  const known = sellersByName[name];

  if (known) {
    return known;
  }

  const id = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return {
    id: id || 'seller',
    name,
    verified: false,
    avatarUrl: '/image/product/seller.png',
    dispatch,
  };
}

const designImages: Record<string, string> = {
  'kreslo-laguna': '/image/cart/chair-laguna.png',
  'krislo-bonro': '/image/cart/chair-bonro.png',
  'krislo-viktoriia': '/image/cart/chair-viktoriia.png',
};

const designVariants: Record<string, LocalizedText> = {
  'kreslo-laguna': { uk: 'Жовтий · вовна / дуб', en: 'Yellow · wool / oak' },
  'krislo-bonro': { uk: 'Чорно-червоне', en: 'Black and red' },
  'krislo-viktoriia': { uk: 'Чорно-червоне', en: 'Black and red' },
};

export function cartImageFor(id: string, fallback?: string) {
  return designImages[id] ?? fallback;
}

export function cartVariantFor(id: string) {
  return designVariants[id];
}

/** Temporary cart until the basket API exists. Matches the filled sidebar design. */
export function mockCartItems(): CartItem[] {
  return [
    {
      id: 'kreslo-laguna',
      title: { uk: 'Крісло Лагуна', en: 'Laguna armchair' },
      imageUrl: designImages['kreslo-laguna'],
      price: 32000,
      oldPrice: 68500,
      variant: designVariants['kreslo-laguna'],
      available: true,
      seller: charge34Seller,
      quantity: 1,
      selected: true,
    },
    {
      id: 'krislo-bonro',
      title: { uk: 'Крісло геймерське Bonro B-0519', en: 'Bonro B-0519 gaming chair' },
      imageUrl: designImages['krislo-bonro'],
      price: 5999,
      oldPrice: 8999,
      variant: designVariants['krislo-bonro'],
      available: true,
      seller: charge34Seller,
      quantity: 1,
      selected: true,
    },
  ];
}
