import { catalogCategories } from '@/config/categories';
import { catalogProducts } from '@/data/catalog-products';
import { homeMock } from '@/data/home';
import type { LocalizedText } from '@/lib/localized';
import type { HomeProduct, Money, ProductBadge } from '@/types/home';

export const FEATURED_PRODUCT_ID = 'kreslo-laguna';

export type ProductSpec = {
  label: LocalizedText;
  value: LocalizedText;
};

export type RelatedCard = {
  id: string;
  title: string;
  category: LocalizedText;
  availability: LocalizedText;
  inStock: boolean;
  price: Money;
  oldPrice?: Money;
  imageUrl: string;
  badge?: ProductBadge;
  sellerName: string;
};

export type ProductSeller = {
  id: string;
  name: string;
  avatarUrl?: string;
  verified: boolean;
  meta?: LocalizedText;
  sold?: LocalizedText;
  dispatch?: LocalizedText;
};

export type ProductDetail = {
  id: string;
  brand: string;
  title: LocalizedText;
  variant?: LocalizedText;
  badge?: ProductBadge;
  availability: LocalizedText;
  inStock: boolean;
  deliveryPromise?: {
    prefix: LocalizedText;
    emphasis: LocalizedText;
    suffix: LocalizedText;
  };
  price: Money;
  oldPrice?: Money;
  images: string[];
  category: LocalizedText;
  categorySlug: string;
  seller: ProductSeller;
  delivery?: {
    free: LocalizedText;
    details: LocalizedText;
  };
  pickup?: LocalizedText;
  description?: {
    title: LocalizedText;
    lead: LocalizedText;
    rest?: LocalizedText;
  };
  specs: ProductSpec[];
  similar: RelatedCard[];
  recent: RelatedCard[];
};

const furniture: LocalizedText = { uk: 'Меблі', en: 'Furniture' };
const tourism: LocalizedText = { uk: 'Туризм', en: 'Tourism' };
const inStock: LocalizedText = { uk: 'В наявності', en: 'In stock' };
const deliveryJan20: LocalizedText = { uk: 'Доставка 20 січня', en: 'Delivery Jan 20' };

const uah = (amount: number): Money => ({ amount, currency: 'UAH' });

const similar: RelatedCard[] = [
  {
    id: 'divan-artemis',
    title: 'Диван Артеміс',
    category: furniture,
    availability: inStock,
    inStock: true,
    price: uah(32000),
    oldPrice: uah(68500),
    imageUrl: '/image/product/card-1.png',
    sellerName: 'CHARGE34',
  },
  {
    id: 'krislo-viktoriia',
    title: 'Крісло Вікторія',
    category: furniture,
    availability: inStock,
    inStock: true,
    price: uah(32000),
    oldPrice: uah(68500),
    imageUrl: '/image/product/card-2.png',
    sellerName: 'Non DI',
  },
  {
    id: 'divan-olimp',
    title: 'Диван Олімп',
    category: furniture,
    availability: inStock,
    inStock: true,
    price: uah(32000),
    oldPrice: uah(68500),
    imageUrl: '/image/product/card-3.png',
    sellerName: 'CHARGE34',
  },
  {
    id: 'krislo-sirius',
    title: 'Крісло Сіріус',
    category: furniture,
    availability: inStock,
    inStock: true,
    price: uah(32000),
    oldPrice: uah(68500),
    imageUrl: '/image/product/card-4.png',
    badge: 'trend',
    sellerName: 'CHARGE34',
  },
  {
    id: 'divan-elehiia',
    title: 'Диван Елегія',
    category: furniture,
    availability: inStock,
    inStock: true,
    price: uah(32000),
    oldPrice: uah(68500),
    imageUrl: '/image/product/card-5.png',
    sellerName: 'CHARGE34',
  },
];

const recent: RelatedCard[] = [
  {
    id: 'krislo-rio',
    title: 'Крісло Ріо',
    category: furniture,
    availability: inStock,
    inStock: true,
    price: uah(32000),
    oldPrice: uah(68500),
    imageUrl: '/image/product/card-6.png',
    badge: 'recommended',
    sellerName: 'Non DI',
  },
  {
    id: 'divan-kaskad',
    title: 'Диван Каскад',
    category: furniture,
    availability: inStock,
    inStock: true,
    price: uah(32000),
    oldPrice: uah(68500),
    imageUrl: '/image/product/card-7.png',
    badge: 'new',
    sellerName: 'CHARGE34',
  },
  {
    id: 'krislo-mirazh',
    title: 'Крісло Міраж',
    category: furniture,
    availability: inStock,
    inStock: true,
    price: uah(32000),
    oldPrice: uah(68500),
    imageUrl: '/image/product/card-8.png',
    badge: 'recommended',
    sellerName: 'CHARGE34',
  },
  {
    id: 'namet-3',
    title: 'Тримісний туристичний намет 200х110 см, Зелений / Намет на 3 персони',
    category: tourism,
    availability: inStock,
    inStock: true,
    price: uah(7000),
    imageUrl: '/image/product/card-9.png',
    badge: 'new',
    sellerName: 'CHARGE34',
  },
  {
    id: 'krislo-bonro',
    title: 'Крісло геймерське, офісне чорно-червоне Bonro B-0519',
    category: furniture,
    availability: deliveryJan20,
    inStock: false,
    price: uah(5999),
    oldPrice: uah(8999),
    imageUrl: '/image/product/card-10.png',
    badge: 'new',
    sellerName: 'CHARGE34',
  },
];

const charge34Seller: ProductSeller = {
  id: 'charge34',
  name: 'CHARGE34',
  avatarUrl: '/image/product/seller.png',
  verified: true,
  meta: {
    uk: 'Київ, Київська область · На Торбі з 2022 року',
    en: 'Kyiv, Kyiv region · On Torba since 2022',
  },
  sold: { uk: '255 продано', en: '255 sold' },
  dispatch: {
    uk: 'Відправка протягом 3 робочих днів',
    en: 'Ships within 3 business days',
  },
};

const featured: ProductDetail = {
  id: FEATURED_PRODUCT_ID,
  brand: 'CHARGE34',
  title: { uk: 'Крісло Лагуна', en: 'Laguna armchair' },
  variant: {
    uk: 'AAL 82 · Суміш вовни / деревяні ніжки',
    en: 'AAL 82 · Wool blend / wooden legs',
  },
  badge: 'new',
  availability: inStock,
  inStock: true,
  deliveryPromise: {
    prefix: { uk: 'Доставка ', en: 'Delivery ' },
    emphasis: { uk: '27 січня', en: 'January 27' },
    suffix: { uk: ' у м. Київ', en: ' in Kyiv' },
  },
  price: uah(32000),
  oldPrice: uah(68500),
  images: [
    '/image/product/gallery-1.png',
    '/image/product/gallery-2.png',
    '/image/product/gallery-3.png',
    '/image/product/gallery-4.png',
    '/image/product/gallery-5.png',
  ],
  category: furniture,
  categorySlug: 'furniture',
  seller: charge34Seller,
  delivery: {
    free: { uk: 'Безкоштовно ', en: 'Free ' },
    details: {
      uk: 'від 599 грн · У відділення  Нової пошти',
      en: 'from 599 UAH · To a Nova Poshta branch',
    },
  },
  pickup: { uk: 'Київ, Київська область', en: 'Kyiv, Kyiv region' },
  description: {
    title: { uk: 'Скандинавський спокій', en: 'Scandinavian calm' },
    lead: {
      uk: 'Жовте крісло у скандинавському стилі — яскравий акцент для затишного інтер’єру. Лаконічний дизайн легко поєднується зі світлими відтінками та природними фактурами.',
      en: 'A yellow Scandinavian armchair — a bright accent for a calm interior. The simple shape sits easily with light tones and natural textures.',
    },
    rest: {
      uk: 'Додайте оселі тепла й кольору: це крісло пасуватиме до вітальні, спальні або куточка для читання. Сонячний жовтий відтінок підкреслить спокійну скандинавську естетику. Компактні розміри (Ш 76 × Д 73 × В 81 см) дозволять легко розмістити його в невеликому просторі, а натуральна тканина із суміші вовни та масив дуба нададуть інтер’єру відчуття тепла та органічної гармонії. Завдяки такому поєднанню крісло стане затишним акцентом у сучасному будинку, де важлива як естетика, так і зручність.',
      en: 'Add warmth and color: this chair belongs in a living room, a bedroom, or a reading corner. The sunny yellow supports a quiet Scandinavian look. Compact dimensions (W 76 × D 73 × H 81 cm) fit a small room, while the wool-blend fabric and solid oak bring warmth and a natural balance. The chair becomes a calm accent in a home that cares about both looks and comfort.',
    },
  },
  specs: [
    {
      label: { uk: 'Розміри', en: 'Dimensions' },
      value: { uk: 'Ш 76 × Д 73 × В 81 см', en: 'W 76 × D 73 × H 81 cm' },
    },
    {
      label: { uk: 'Матеріали', en: 'Materials' },
      value: {
        uk: 'Тканина із суміші вовни, масив дуба',
        en: 'Wool-blend fabric, solid oak',
      },
    },
    {
      label: { uk: 'Колір', en: 'Color' },
      value: { uk: 'Жовтий', en: 'Yellow' },
    },
    {
      label: { uk: 'Вага', en: 'Weight' },
      value: { uk: '53 кг', en: '53 kg' },
    },
    {
      label: { uk: 'Виробник', en: 'Manufacturer' },
      value: { uk: 'CHARGE34', en: 'CHARGE34' },
    },
    {
      label: { uk: 'Країна походження', en: 'Country of origin' },
      value: { uk: 'Китай', en: 'China' },
    },
  ],
  similar,
  recent,
};

function specsFromMock(
  sellerName: string,
  category: LocalizedText,
  location?: string,
): ProductSpec[] {
  return [
    {
      label: { uk: 'Виробник', en: 'Manufacturer' },
      value: { uk: sellerName, en: sellerName },
    },
    {
      label: { uk: 'Категорія', en: 'Category' },
      value: category,
    },
    ...(location
      ? [
          {
            label: { uk: 'Місто', en: 'City' },
            value: { uk: location, en: location },
          },
        ]
      : []),
  ];
}

function detailFromCard(card: RelatedCard): ProductDetail {
  const seller =
    card.sellerName === charge34Seller.name
      ? charge34Seller
      : {
          id: 'non-di',
          name: card.sellerName,
          verified: false,
        };

  return {
    id: card.id,
    brand: card.sellerName,
    title: { uk: card.title, en: card.title },
    badge: card.badge,
    availability: card.availability,
    inStock: card.inStock,
    price: card.price,
    oldPrice: card.oldPrice,
    images: [card.imageUrl],
    category: card.category,
    categorySlug: card.category.uk === tourism.uk ? 'tourism' : 'furniture',
    seller,
    specs: specsFromMock(card.sellerName, card.category),
    similar,
    recent,
  };
}

function detailFromCatalog(product: (typeof catalogProducts)[number]): ProductDetail {
  const peers = catalogProducts.filter(
    (item) => item.categorySlug === product.categorySlug && item.id !== product.id,
  );
  const toCard = (item: (typeof catalogProducts)[number]): RelatedCard => ({
    id: item.id,
    title: item.title,
    category: item.categoryName,
    availability: item.availability,
    inStock: item.availability.uk === 'В наявності',
    price: item.price,
    oldPrice: item.oldPrice,
    imageUrl: item.imageUrl ?? '/image/home/product-1.png',
    badge: item.badge,
    sellerName: item.sellerName,
  });

  return {
    id: product.id,
    brand: product.sellerName,
    title: { uk: product.title, en: product.title },
    badge: product.badge,
    availability: product.availability,
    inStock: product.availability.uk === 'В наявності',
    price: product.price,
    oldPrice: product.oldPrice,
    images: [product.imageUrl ?? '/image/home/product-1.png'],
    category: product.categoryName,
    categorySlug: product.categorySlug,
    seller: {
      id: product.sellerId,
      name: product.sellerName,
      avatarUrl: featured.seller.avatarUrl,
      verified: product.sellerName === featured.seller.name,
      meta: product.location
        ? { uk: product.location, en: product.location }
        : featured.seller.meta,
      sold: featured.seller.sold,
      dispatch: featured.seller.dispatch,
    },
    delivery: product.offers.includes('delivery') ? featured.delivery : undefined,
    pickup: product.offers.includes('pickup')
      ? product.location
        ? { uk: product.location, en: product.location }
        : featured.pickup
      : undefined,
    description: featured.description,
    specs: specsFromMock(product.sellerName, product.categoryName, product.location),
    similar: peers.slice(0, 5).map(toCard),
    recent: peers.slice(5, 10).map(toCard),
  };
}

function categorySlugFromName(name: LocalizedText): string {
  return (
    catalogCategories.find((item) => item.name.uk === name.uk || item.name.en === name.en)
      ?.slug ?? ''
  );
}

function sellerIdFromName(name: string): string {
  if (name === 'CHARGE34') {
    return 'charge34';
  }

  if (name.toLowerCase() === 'non di') {
    return 'non-di';
  }

  return '';
}

function toRelated(product: HomeProduct): RelatedCard {
  return {
    id: product.id,
    title: product.title,
    category: product.categoryName,
    availability: product.availability,
    inStock: product.availability.uk === 'В наявності',
    price: product.price,
    oldPrice: product.oldPrice,
    imageUrl: product.imageUrl ?? featured.images[0],
    badge: product.badge,
    sellerName: product.sellerName,
  };
}

function detailFromListing(product: HomeProduct, peers: HomeProduct[]): ProductDetail {
  const location = product.location
    ? { uk: product.location, en: product.location }
    : undefined;
  const related = peers.filter((item) => item.id !== product.id);
  const similarCards = related.slice(0, 5).map(toRelated);
  const recentCards = related.slice(5, 10).map(toRelated);

  return {
    id: product.id,
    brand: product.sellerName,
    title: { uk: product.title, en: product.title },
    badge: product.badge,
    availability: product.availability,
    inStock: product.availability.uk === 'В наявності',
    price: product.price,
    oldPrice: product.oldPrice,
    images: product.imageUrl ? [product.imageUrl] : featured.images,
    category: product.categoryName,
    categorySlug: categorySlugFromName(product.categoryName),
    seller: {
      id: sellerIdFromName(product.sellerName),
      name: product.sellerName,
      avatarUrl: featured.seller.avatarUrl,
      verified: product.sellerName === featured.seller.name,
      meta: location ?? featured.seller.meta,
      sold: featured.seller.sold,
      dispatch: featured.seller.dispatch,
    },
    delivery: featured.delivery,
    pickup: location ?? featured.pickup,
    description: featured.description,
    specs: specsFromMock(product.sellerName, product.categoryName, product.location),
    similar: similarCards.length > 0 ? similarCards : featured.similar,
    recent: recentCards.length > 0 ? recentCards : featured.recent,
  };
}

const cardsById = new Map([...similar, ...recent].map((card) => [card.id, card]));

export function getProductDetail(id: string): ProductDetail | null {
  if (id === featured.id) {
    return featured;
  }

  const card = cardsById.get(id);

  if (card) {
    return detailFromCard(card);
  }

  const catalog = catalogProducts.find((product) => product.id === id);

  if (catalog) {
    return detailFromCatalog(catalog);
  }

  const listing = homeMock.trending.find((product) => product.id === id);

  return listing ? detailFromListing(listing, homeMock.trending) : null;
}

export function discountPercent(price: Money, oldPrice: Money): number {
  if (oldPrice.amount <= 0) {
    return 0;
  }

  return Math.round((1 - price.amount / oldPrice.amount) * 100);
}

export function figmaMoney(amount: number): string {
  const digits = Math.round(amount).toString();
  const grouped =
    digits.length > 4 ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') : digits;

  return `₴${grouped}`;
}
