import type { LocalizedText } from '@/lib/localized';

export type Money = {
  amount: number;
  currency: 'UAH';
};

export type ProductSummary = {
  id: string;
  title: string;
  price: Money;
  imageUrl?: string;
  location?: string;
  createdAt: string;
};

export type HomeBanner = {
  id: string;
  title: LocalizedText;
  subtitle?: LocalizedText;
  href: string;
  imageUrl: string;
  /** wide = main carousel slide, side = smaller promo */
  variant: 'wide' | 'side';
  /** dark slides need light text; default dark text on light art */
  textTone?: 'dark' | 'light';
};

export type HomeCategory = {
  id: string;
  slug: string;
  name: LocalizedText;
  imageUrl: string;
};

export type ProductBadge = 'new' | 'trend' | 'recommended';

export type HomeProduct = ProductSummary & {
  badge?: ProductBadge;
  categoryName: LocalizedText;
  oldPrice?: Money;
  availability: LocalizedText;
  sellerName: string;
};

export type HomeFeed = {
  banners: HomeBanner[];
  popularCategories: HomeCategory[];
  trending: HomeProduct[];
};
