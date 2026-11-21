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

function spec(
  labelUk: string,
  labelEn: string,
  valueUk: string,
  valueEn: string = valueUk,
): ProductSpec {
  return {
    label: { uk: labelUk, en: labelEn },
    value: { uk: valueUk, en: valueEn },
  };
}

const specsById: Record<string, ProductSpec[]> = {
  'divan-artemis': [
    spec('Розміри', 'Dimensions', 'Ш 220 × Д 95 × В 85 см', 'W 220 × D 95 × H 85 cm'),
    spec('Матеріали', 'Materials', 'Велюр, масив бука', 'Velvet, solid beech'),
    spec('Колір', 'Color', 'Сірий', 'Grey'),
    spec('Вага', 'Weight', '48 кг', '48 kg'),
    spec('Виробник', 'Manufacturer', 'CHARGE34'),
    spec('Країна походження', 'Country of origin', 'Польща', 'Poland'),
  ],
  'krislo-viktoriia': [
    spec('Розміри', 'Dimensions', 'Ш 68 × Д 70 × В 96 см', 'W 68 × D 70 × H 96 cm'),
    spec('Матеріали', 'Materials', 'Штучна шкіра, метал', 'Faux leather, metal'),
    spec('Колір', 'Color', 'Бежевий', 'Beige'),
    spec('Вага', 'Weight', '18 кг', '18 kg'),
    spec('Виробник', 'Manufacturer', 'Non DI'),
    spec('Країна походження', 'Country of origin', 'Італія', 'Italy'),
  ],
  'divan-olimp': [
    spec('Розміри', 'Dimensions', 'Ш 240 × Д 100 × В 82 см', 'W 240 × D 100 × H 82 cm'),
    spec('Матеріали', 'Materials', 'Рогожка, фанера', 'Bouclé, plywood'),
    spec('Колір', 'Color', 'Зелений', 'Green'),
    spec('Вага', 'Weight', '62 кг', '62 kg'),
    spec('Виробник', 'Manufacturer', 'CHARGE34'),
    spec('Країна походження', 'Country of origin', 'Україна', 'Ukraine'),
  ],
  'krislo-sirius': [
    spec('Розміри', 'Dimensions', 'Ш 80 × Д 78 × В 90 см', 'W 80 × D 78 × H 90 cm'),
    spec('Матеріали', 'Materials', 'Льон, масив дуба', 'Linen, solid oak'),
    spec('Колір', 'Color', 'Синій', 'Blue'),
    spec('Вага', 'Weight', '21 кг', '21 kg'),
    spec('Виробник', 'Manufacturer', 'CHARGE34'),
    spec('Країна походження', 'Country of origin', 'Китай', 'China'),
  ],
  'divan-elehiia': [
    spec('Розміри', 'Dimensions', 'Ш 210 × Д 92 × В 88 см', 'W 210 × D 92 × H 88 cm'),
    spec('Матеріали', 'Materials', 'Бавовна, масив ясена', 'Cotton, solid ash'),
    spec('Колір', 'Color', 'Пісочний', 'Sand'),
    spec('Вага', 'Weight', '44 кг', '44 kg'),
    spec('Виробник', 'Manufacturer', 'CHARGE34'),
  ],
  'krislo-rio': [
    spec('Розміри', 'Dimensions', 'Ш 72 × Д 74 × В 84 см', 'W 72 × D 74 × H 84 cm'),
    spec('Матеріали', 'Materials', 'Велюр, метал', 'Velvet, metal'),
    spec('Колір', 'Color', 'Теракотовий', 'Terracotta'),
    spec('Виробник', 'Manufacturer', 'Non DI'),
    spec('Країна походження', 'Country of origin', 'Польща', 'Poland'),
  ],
  'divan-kaskad': [
    spec('Розміри', 'Dimensions', 'Ш 260 × Д 105 × В 80 см', 'W 260 × D 105 × H 80 cm'),
    spec('Матеріали', 'Materials', 'Шеніл, ДСП', 'Chenille, particle board'),
    spec('Колір', 'Color', 'Графіт', 'Graphite'),
    spec('Вага', 'Weight', '71 кг', '71 kg'),
    spec('Виробник', 'Manufacturer', 'CHARGE34'),
    spec('Країна походження', 'Country of origin', 'Китай', 'China'),
  ],
  'krislo-mirazh': [
    spec('Розміри', 'Dimensions', 'Ш 75 × Д 80 × В 102 см', 'W 75 × D 80 × H 102 cm'),
    spec('Матеріали', 'Materials', 'Екошкіра, фанера', 'Eco-leather, plywood'),
    spec('Колір', 'Color', 'Чорний', 'Black'),
    spec('Вага', 'Weight', '19 кг', '19 kg'),
    spec('Виробник', 'Manufacturer', 'CHARGE34'),
    spec('Країна походження', 'Country of origin', 'Китай', 'China'),
  ],
  'namet-3': [
    spec('Розміри', 'Dimensions', '200 × 110 × 110 см', '200 × 110 × 110 cm'),
    spec('Місткість', 'Capacity', '3 особи', '3 people'),
    spec('Матеріали', 'Materials', 'Поліестер, фіберглас', 'Polyester, fiberglass'),
    spec('Колір', 'Color', 'Зелений', 'Green'),
    spec('Вага', 'Weight', '3,2 кг', '3.2 kg'),
    spec('Виробник', 'Manufacturer', 'CHARGE34'),
  ],
  'krislo-bonro': [
    spec('Розміри', 'Dimensions', 'Ш 68 × Д 70 × В 125 см', 'W 68 × D 70 × H 125 cm'),
    spec('Матеріали', 'Materials', 'Екошкіра, метал', 'Eco-leather, metal'),
    spec('Колір', 'Color', 'Чорно-червоний', 'Black and red'),
    spec('Вага', 'Weight', '22 кг', '22 kg'),
    spec('Виробник', 'Manufacturer', 'CHARGE34'),
    spec('Країна походження', 'Country of origin', 'Китай', 'China'),
  ],
  p1: [
    spec('Ємність', 'Capacity', '1024 Вт·год', '1024 Wh'),
    spec('Потужність', 'Power', '1000 Вт', '1000 W'),
    spec('Вага', 'Weight', '12,5 кг', '12.5 kg'),
    spec('Колір', 'Color', 'Чорний', 'Black'),
    spec('Виробник', 'Manufacturer', 'CHARGE34'),
    spec('Країна походження', 'Country of origin', 'Китай', 'China'),
  ],
  p2: [
    spec('Розміри', 'Dimensions', '800 × 600 × 400 мм', '800 × 600 × 400 mm'),
    spec('Матеріали', 'Materials', 'Сталь, алюміній', 'Steel, aluminium'),
    spec('Потужність', 'Power', '1500 Вт', '1500 W'),
    spec('Вага', 'Weight', '85 кг', '85 kg'),
    spec('Виробник', 'Manufacturer', 'ToolPro'),
    spec('Країна походження', 'Country of origin', 'Китай', 'China'),
  ],
  p3: [
    spec('Стандарт', 'Standard', 'Wi-Fi 5, AC1200'),
    spec('Діапазони', 'Bands', '2,4 / 5 ГГц', '2.4 / 5 GHz'),
    spec('Колір', 'Color', 'Чорний', 'Black'),
    spec('Вага', 'Weight', '0,4 кг', '0.4 kg'),
    spec('Виробник', 'Manufacturer', 'NetHub'),
    spec('Країна походження', 'Country of origin', 'Китай', 'China'),
  ],
  p4: [
    spec('Висота', 'Height', '28 см', '28 cm'),
    spec('Матеріали', 'Materials', 'Кришталь, метал', 'Crystal, metal'),
    spec('Колір', 'Color', 'Прозорий', 'Clear'),
    spec('Живлення', 'Power', 'USB, 5 В', 'USB, 5 V'),
    spec('Виробник', 'Manufacturer', 'LightBox'),
  ],
  p5: [
    spec('Висота', 'Height', '35 см', '35 cm'),
    spec('Матеріали', 'Materials', 'Плюш, холлофайбер', 'Plush, hollow fiber'),
    spec('Колір', 'Color', 'Коричневий', 'Brown'),
    spec('Виробник', 'Manufacturer', 'Kids&Co'),
    spec('Країна походження', 'Country of origin', 'Китай', 'China'),
  ],
  p6: [
    spec('Розмір', 'Size', '200 × 220 см', '200 × 220 cm'),
    spec('Матеріали', 'Materials', 'Бавовна сатин', 'Cotton sateen'),
    spec('Колір', 'Color', 'Білий', 'White'),
    spec('Щільність', 'Density', '120 г/м²', '120 g/m²'),
    spec('Виробник', 'Manufacturer', 'HomeSoft'),
    spec('Країна походження', 'Country of origin', 'Туреччина', 'Turkey'),
  ],
  p7: [
    spec('Розміри', 'Dimensions', '240 × 210 × 130 см', '240 × 210 × 130 cm'),
    spec('Місткість', 'Capacity', '4 особи', '4 people'),
    spec('Матеріали', 'Materials', 'Поліестер 190T', 'Polyester 190T'),
    spec('Колір', 'Color', 'Хакі', 'Khaki'),
    spec('Вага', 'Weight', '4,8 кг', '4.8 kg'),
    spec('Виробник', 'Manufacturer', 'CampUA'),
    spec('Країна походження', 'Country of origin', 'Україна', 'Ukraine'),
  ],
  p8: [
    spec('Розміри', 'Dimensions', 'Ш 67 × Д 68 × В 128 см', 'W 67 × D 68 × H 128 cm'),
    spec('Матеріали', 'Materials', 'Екошкіра, нейлон', 'Eco-leather, nylon'),
    spec('Колір', 'Color', 'Чорний', 'Black'),
    spec('Вага', 'Weight', '20 кг', '20 kg'),
    spec('Виробник', 'Manufacturer', 'GameSeat'),
    spec('Країна походження', 'Country of origin', 'Китай', 'China'),
  ],
};

const mockColors: LocalizedText[] = [
  { uk: 'Чорний', en: 'Black' },
  { uk: 'Білий', en: 'White' },
  { uk: 'Сірий', en: 'Grey' },
  { uk: 'Бежевий', en: 'Beige' },
  { uk: 'Зелений', en: 'Green' },
];

const mockCountries: LocalizedText[] = [
  { uk: 'Китай', en: 'China' },
  { uk: 'Польща', en: 'Poland' },
  { uk: 'Туреччина', en: 'Turkey' },
  { uk: 'Україна', en: 'Ukraine' },
];

const clothingSizes = ['S', 'M', 'L', 'XL'] as const;

function specSeed(id: string): number {
  return [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function specsForProduct(id: string, sellerName: string, categorySlug: string): ProductSpec[] {
  const designed = specsById[id];

  if (designed) {
    return designed;
  }

  const seed = specSeed(id);
  const color = mockColors[seed % mockColors.length];
  const country = mockCountries[seed % mockCountries.length];
  const manufacturer = spec('Виробник', 'Manufacturer', sellerName);
  const origin = spec('Країна походження', 'Country of origin', country.uk, country.en);
  const colorSpec = spec('Колір', 'Color', color.uk, color.en);

  if (categorySlug === 'clothing') {
    const size = clothingSizes[seed % clothingSizes.length];

    return [
      spec('Розмір', 'Size', size),
      spec('Матеріали', 'Materials', 'Бавовна', 'Cotton'),
      colorSpec,
      manufacturer,
      origin,
    ];
  }

  if (categorySlug === 'electronics') {
    return [
      spec('Потужність', 'Power', `${200 + (seed % 8) * 100} Вт`, `${200 + (seed % 8) * 100} W`),
      colorSpec,
      spec('Вага', 'Weight', `${1 + (seed % 6)} кг`, `${1 + (seed % 6)} kg`),
      manufacturer,
      origin,
    ];
  }

  if (categorySlug === 'lighting') {
    return [
      spec('Потужність', 'Power', `${6 + (seed % 5) * 2} Вт`, `${6 + (seed % 5) * 2} W`),
      spec('Матеріали', 'Materials', 'Метал, скло', 'Metal, glass'),
      colorSpec,
      manufacturer,
    ];
  }

  if (categorySlug === 'power') {
    return [
      spec('Ємність', 'Capacity', `${256 + (seed % 4) * 256} Вт·год`, `${256 + (seed % 4) * 256} Wh`),
      spec('Потужність', 'Power', `${300 + (seed % 5) * 200} Вт`, `${300 + (seed % 5) * 200} W`),
      spec('Вага', 'Weight', `${4 + (seed % 8)} кг`, `${4 + (seed % 8)} kg`),
      manufacturer,
      origin,
    ];
  }

  if (categorySlug === 'garden') {
    return [
      spec(
        'Розміри',
        'Dimensions',
        `Ш ${40 + (seed % 20)} × Д ${30 + (seed % 15)} × В ${20 + (seed % 25)} см`,
        `W ${40 + (seed % 20)} × D ${30 + (seed % 15)} × H ${20 + (seed % 25)} cm`,
      ),
      spec('Матеріали', 'Materials', 'Сталь, пластик', 'Steel, plastic'),
      spec('Вага', 'Weight', `${2 + (seed % 12)} кг`, `${2 + (seed % 12)} kg`),
      manufacturer,
      origin,
    ];
  }

  return [
    spec(
      'Розміри',
      'Dimensions',
      `Ш ${60 + (seed % 40)} × Д ${50 + (seed % 30)} × В ${40 + (seed % 50)} см`,
      `W ${60 + (seed % 40)} × D ${50 + (seed % 30)} × H ${40 + (seed % 50)} cm`,
    ),
    spec('Матеріали', 'Materials', 'Тканина, дерево', 'Fabric, wood'),
    colorSpec,
    spec('Вага', 'Weight', `${8 + (seed % 25)} кг`, `${8 + (seed % 25)} kg`),
    manufacturer,
    origin,
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
    specs: specsForProduct(
      card.id,
      card.sellerName,
      card.category.uk === tourism.uk ? 'tourism' : 'furniture',
    ),
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
    specs: specsForProduct(product.id, product.sellerName, product.categorySlug),
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
    specs: specsForProduct(
      product.id,
      product.sellerName,
      categorySlugFromName(product.categoryName),
    ),
    similar: similarCards.length > 0 ? similarCards : featured.similar,
    recent: recentCards.length > 0 ? recentCards : featured.recent,
  };
}

const cardsById = new Map([...similar, ...recent].map((card) => [card.id, card]));

export function relatedCardFor(id: string): RelatedCard | null {
  if (id === featured.id) {
    return {
      id: featured.id,
      title: featured.title.uk,
      category: featured.category,
      availability: featured.availability,
      inStock: featured.inStock,
      price: featured.price,
      oldPrice: featured.oldPrice,
      imageUrl: featured.images[0] ?? '',
      badge: featured.badge,
      sellerName: featured.seller.name,
    };
  }

  const known = cardsById.get(id);

  if (known) {
    return known;
  }

  const catalog = catalogProducts.find((product) => product.id === id);

  if (catalog) {
    return {
      id: catalog.id,
      title: catalog.title,
      category: catalog.categoryName,
      availability: catalog.availability,
      inStock: catalog.availability.uk === 'В наявності',
      price: catalog.price,
      oldPrice: catalog.oldPrice,
      imageUrl: catalog.imageUrl ?? '/image/home/product-1.png',
      badge: catalog.badge,
      sellerName: catalog.sellerName,
    };
  }

  const listing = homeMock.trending.find((product) => product.id === id);

  return listing ? toRelated(listing) : null;
}

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
