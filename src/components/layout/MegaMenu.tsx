'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { catalogCategories, categoryHref } from '@/config/categories';
import { localized } from '@/lib/localized';

type MegaMenuProps = {
  onNavigate: () => void;
};

export function MegaMenu({ onNavigate }: MegaMenuProps) {
  const { i18n } = useTranslation();

  return (
    <div
      id="header-mega-menu"
      className="grid grid-cols-2 gap-x-6 gap-y-6 py-4 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-8 sm:py-6 lg:grid-cols-6"
    >
      {catalogCategories.map((category) => (
        <div key={category.slug}>
          <Link
            href={categoryHref(category.slug)}
            onClick={onNavigate}
            className="text-sm font-semibold text-(--color-ink) hover:text-(--color-brand)"
          >
            {localized(category.name, i18n.language)}
          </Link>
          <ul className="mt-3 space-y-2">
            {category.children.map((child) => (
              <li key={child.slug}>
                <Link
                  href={categoryHref(category.slug, child.slug)}
                  onClick={onNavigate}
                  className="text-sm text-(--color-muted) hover:text-(--color-ink)"
                >
                  {localized(child.name, i18n.language)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
