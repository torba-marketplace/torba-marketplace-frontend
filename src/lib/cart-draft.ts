import { cartImageFor, cartVariantFor, sellerFromName } from '@/data/cart-mock';
import type { ProductDetail, RelatedCard } from '@/data/product-page';
import type { LocalizedText } from '@/lib/localized';
import type { HomeProduct } from '@/types/home';
import type { CartDraft } from '@/types/cart';

function text(value: string): LocalizedText {
  return { uk: value, en: value };
}

function variantFromDetail(product: ProductDetail): LocalizedText | undefined {
  const designed = cartVariantFor(product.id);

  if (designed) {
    return designed;
  }

  const color = product.specs.find((item) => item.label.uk === 'Колір');
  const material = product.specs.find((item) => item.label.uk === 'Матеріали');

  if (!color && !material) {
    return product.variant;
  }

  return {
    uk: [color?.value.uk, material?.value.uk].filter(Boolean).join(' · '),
    en: [color?.value.en, material?.value.en].filter(Boolean).join(' · '),
  };
}

export function draftFromHome(product: HomeProduct): CartDraft {
  return {
    id: product.id,
    title: text(product.title),
    imageUrl: cartImageFor(product.id, product.imageUrl),
    price: product.price.amount,
    oldPrice: product.oldPrice?.amount,
    variant: cartVariantFor(product.id),
    available: product.availability.uk !== 'Недоступно',
    seller: sellerFromName(product.sellerName),
  };
}

export function draftFromDetail(product: ProductDetail): CartDraft {
  return {
    id: product.id,
    title: product.title,
    imageUrl: cartImageFor(product.id, product.images[0]),
    price: product.price.amount,
    oldPrice: product.oldPrice?.amount,
    variant: variantFromDetail(product),
    available: product.inStock,
    seller: sellerFromName(product.seller.name),
  };
}

export function draftFromRelated(product: RelatedCard): CartDraft {
  return {
    id: product.id,
    title: text(product.title),
    imageUrl: cartImageFor(product.id, product.imageUrl),
    price: product.price.amount,
    oldPrice: product.oldPrice?.amount,
    variant: cartVariantFor(product.id),
    available: product.inStock,
    seller: sellerFromName(product.sellerName),
  };
}
