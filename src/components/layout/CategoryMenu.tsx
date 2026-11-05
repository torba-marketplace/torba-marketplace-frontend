'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { categoryHref, type CatalogCategory } from '@/config/categories';
import { localized } from '@/lib/localized';

type CategoryMenuProps = {
  category: CatalogCategory;
  onNavigate: () => void;
};

export function CategoryMenu({ category, onNavigate }: CategoryMenuProps) {
  const { i18n } = useTranslation();

  return (
    <div
      id={`header-category-${category.slug}`}
      className="absolute top-full left-0 z-50 mt-2 min-w-56 rounded-xl border border-(--color-border) bg-(--color-surface) p-2 shadow-lg"
    >
      <ul className="space-y-0.5">
        {category.children.map((child) => (
          <li key={child.slug}>
            <Link
              href={categoryHref(category.slug, child.slug)}
              onClick={onNavigate}
              className="block rounded-lg px-3 py-2 text-sm text-(--color-ink) hover:bg-(--color-surface-muted)"
            >
              {localized(child.name, i18n.language)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
