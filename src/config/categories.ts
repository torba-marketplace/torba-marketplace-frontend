import type { LocalizedText } from '@/lib/localized';

export type CatalogLink = {
  slug: string;
  name: LocalizedText;
};

export type CatalogCategory = CatalogLink & {
  children: CatalogLink[];
};

// Temporary FE mock from Figma Ready for Dev.
// TODO: replace with GET /api/categories when the Python API is available.
// once BE slugs match the design (see sync with Bohdan / ZETAN01-7 seed).
export const catalogCategories: CatalogCategory[] = [
  {
    slug: 'furniture',
    name: { uk: 'Меблі', en: 'Furniture' },
    children: [
      { slug: 'chairs', name: { uk: 'Стільці та сидіння', en: 'Chairs & seating' } },
      { slug: 'sofas', name: { uk: 'Дивани та крісла', en: 'Sofas & armchairs' } },
      { slug: 'beds', name: { uk: 'Ліжка та спальні', en: 'Beds & bedrooms' } },
      { slug: 'storage', name: { uk: 'Зберігання та полиці', en: 'Storage & shelves' } },
      { slug: 'tables', name: { uk: 'Столи', en: 'Tables' } },
    ],
  },
  {
    slug: 'clothing',
    name: { uk: 'Одяг', en: 'Clothing' },
    children: [
      { slug: 'tshirts', name: { uk: 'Футболки', en: 'T-shirts' } },
      { slug: 'shirts', name: { uk: 'Сорочки', en: 'Shirts' } },
      { slug: 'trousers', name: { uk: 'Штани', en: 'Trousers' } },
      { slug: 'outerwear', name: { uk: 'Верхній одяг', en: 'Outerwear' } },
      { slug: 'shoes', name: { uk: 'Взуття', en: 'Shoes' } },
    ],
  },
  {
    slug: 'electronics',
    name: { uk: 'Електроніка', en: 'Electronics' },
    children: [
      { slug: 'scooters', name: { uk: 'Електросамокати', en: 'Electric scooters' } },
      { slug: 'kitchen', name: { uk: 'Кухонні пристрої', en: 'Kitchen appliances' } },
      { slug: 'laptops', name: { uk: 'Ноутбуки', en: 'Laptops' } },
      { slug: 'chargers', name: { uk: 'Зарядні пристрої', en: 'Chargers' } },
      { slug: 'smartwatches', name: { uk: 'Смарт-годинники', en: 'Smartwatches' } },
    ],
  },
  {
    slug: 'lighting',
    name: { uk: 'Освітлення', en: 'Lighting' },
    children: [
      { slug: 'lamps', name: { uk: 'Лампи', en: 'Lamps' } },
      { slug: 'fixtures', name: { uk: 'Світильники', en: 'Light fixtures' } },
      { slug: 'led', name: { uk: 'LED', en: 'LED' } },
      { slug: 'chandeliers', name: { uk: 'Люстри', en: 'Chandeliers' } },
      { slug: 'nightlights', name: { uk: 'Нічники', en: 'Night lights' } },
    ],
  },
  {
    slug: 'power',
    name: { uk: 'Зарядні пристрої', en: 'Power & charging' },
    children: [
      { slug: 'stations', name: { uk: 'Зарядні станції', en: 'Charging stations' } },
      { slug: 'generators', name: { uk: 'Генератори', en: 'Generators' } },
      { slug: 'powerbanks', name: { uk: 'Павербанки', en: 'Power banks' } },
      { slug: 'solar', name: { uk: 'Сонячні панелі', en: 'Solar panels' } },
      { slug: 'inverters', name: { uk: 'Інвертори', en: 'Inverters' } },
    ],
  },
  {
    slug: 'garden',
    name: { uk: 'Сад і город', en: 'Garden' },
    children: [
      { slug: 'equipment', name: { uk: 'Садова техніка', en: 'Garden equipment' } },
      { slug: 'irrigation', name: { uk: 'Системи поливу', en: 'Irrigation systems' } },
      { slug: 'plants', name: { uk: 'Рослини', en: 'Plants' } },
      { slug: 'pools', name: { uk: 'Басейни', en: 'Pools' } },
      { slug: 'tools', name: { uk: 'Інструменти', en: 'Tools' } },
    ],
  },
];

export const featuredCategorySlugs = [
  'furniture',
  'electronics',
  'lighting',
  'power',
  'clothing',
  'garden',
] as const;

export function categoryHref(categorySlug: string, childSlug?: string): string {
  const params = new URLSearchParams({ category: categorySlug });
  if (childSlug) {
    params.set('sub', childSlug);
  }
  return `/catalog?${params.toString()}`;
}

export function featuredCategories(): CatalogCategory[] {
  return featuredCategorySlugs.map((slug) => {
    const category = catalogCategories.find((item) => item.slug === slug);
    if (!category) {
      throw new Error(`Unknown featured category: ${slug}`);
    }
    return category;
  });
}
