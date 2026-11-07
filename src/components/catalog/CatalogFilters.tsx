'use client';

import { ChevronDown } from '@untitledui/icons';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { CatalogCategory } from '@/config/categories';
import { findLocation } from '@/config/locations';
import type { CatalogQuery } from '@/lib/catalog-query';
import { cn } from '@/lib/cn';
import { localized } from '@/lib/localized';
import type { CatalogCategoryFilters } from '@/types/catalog-filters';

type CatalogFiltersProps = {
  category: CatalogCategory;
  filters: CatalogCategoryFilters;
  query: CatalogQuery;
  onQueryChange: (next: CatalogQuery) => void;
};

function sectionTitle(label: string, open: boolean, onToggle: () => void) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between py-1 text-left text-sm font-semibold text-(--color-dark-800)"
      aria-expanded={open}
      onClick={onToggle}
    >
      {label}
      <ChevronDown
        className={cn('size-4 transition-transform', open && 'rotate-180')}
        aria-hidden
      />
    </button>
  );
}

export function CatalogFilters({ category, filters, query, onQueryChange }: CatalogFiltersProps) {
  const { t, i18n } = useTranslation();
  const [sections, setSections] = useState({
    category: true,
    price: true,
    sellers: true,
    place: true,
  });
  const [showAllSellers, setShowAllSellers] = useState(false);
  const bounds = filters.price;
  const minValue = query.min ?? bounds.min;
  const maxValue = query.max ?? bounds.max;
  const priceKey = `${query.min ?? ''}|${query.max ?? ''}`;
  const [priceDraft, setPriceDraft] = useState<{
    key: string;
    min: string;
    max: string;
  } | null>(null);
  const activeDraft = priceDraft?.key === priceKey ? priceDraft : null;
  const minText = activeDraft?.min ?? String(minValue);
  const maxText = activeDraft?.max ?? String(maxValue);
  const minInputRef = useRef<HTMLInputElement>(null);
  const maxInputRef = useRef<HTMLInputElement>(null);
  const queryRef = useRef(query);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);
  const [dragMin, setDragMin] = useState<number | null>(null);
  const [dragMax, setDragMax] = useState<number | null>(null);
  const location = findLocation(filters.locationId);
  const categoryLabel = localized(category.name, i18n.language);
  const sellers = showAllSellers ? filters.sellers : filters.sellers.slice(0, 3);
  const span = Math.max(bounds.max - bounds.min, 1);
  const sliderMin = dragMin ?? minValue;
  const sliderMax = dragMax ?? maxValue;

  const change = (patch: Partial<CatalogQuery>, keepPage = false) => {
    const current = queryRef.current;
    const next: CatalogQuery = {
      ...current,
      category: category.slug,
      ...patch,
      page: keepPage ? (patch.page ?? current.page) : 1,
    };

    queryRef.current = next;
    onQueryChange(next);
  };

  const commitPrice = (min: number, max: number) => {
    const nextMin = Math.min(Math.max(min, bounds.min), bounds.max);
    const nextMax = Math.min(Math.max(max, bounds.min), bounds.max);
    const low = Math.min(nextMin, nextMax);
    const high = Math.max(nextMin, nextMax);

    change({
      min: low === bounds.min ? null : low,
      max: high === bounds.max ? null : high,
    });
  };

  const commitTextPrice = () => {
    const minRaw = minInputRef.current?.value ?? minText;
    const maxRaw = maxInputRef.current?.value ?? maxText;
    const min = minRaw.trim() === '' ? bounds.min : Number(minRaw);
    const max = maxRaw.trim() === '' ? bounds.max : Number(maxRaw);

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      setPriceDraft(null);
      return;
    }

    setPriceDraft(null);
    commitPrice(min, max);
  };

  const toggleSeller = (id: string) => {
    const current = queryRef.current.sellers;
    const sellersNext = current.includes(id)
      ? current.filter((seller) => seller !== id)
      : [...current, id];

    change({ sellers: sellersNext });
  };

  const toggleDelivery = (id: CatalogQuery['delivery'][number]) => {
    const current = queryRef.current.delivery;
    const delivery = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];

    change({ delivery });
  };

  const reset = () => {
    const next: CatalogQuery = {
      category: category.slug,
      sub: null,
      min: null,
      max: null,
      sellers: [],
      delivery: [],
      page: 1,
      sort: queryRef.current.sort,
    };

    queryRef.current = next;
    onQueryChange(next);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-md font-semibold text-(--color-dark-800)">
          {t('pages.catalog.filters')}
        </h2>
        <button
          type="button"
          className="text-sm font-medium text-(--color-primary-700) hover:text-(--color-primary-800)"
          onClick={reset}
        >
          {t('pages.catalog.reset')}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {sectionTitle(categoryLabel, sections.category, () =>
          setSections((current) => ({ ...current, category: !current.category })),
        )}
        {sections.category ? (
          <div className="flex flex-col">
            <FilterOption
              label={t('pages.catalog.allInCategory', {
                category: categoryLabel.charAt(0).toLowerCase() + categoryLabel.slice(1),
              })}
              count={filters.totalCount}
              selected={query.sub === null}
              onClick={() => change({ sub: null })}
            />
            {filters.subcategories.map((item) => {
              const child = category.children.find((entry) => entry.slug === item.slug);

              if (!child) {
                return null;
              }

              return (
                <FilterOption
                  key={item.slug}
                  label={localized(child.name, i18n.language)}
                  count={item.count}
                  selected={query.sub === item.slug}
                  onClick={() => change({ sub: item.slug })}
                />
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        {sectionTitle(t('pages.catalog.price'), sections.price, () =>
          setSections((current) => ({ ...current, price: !current.price })),
        )}
        {sections.price ? (
          <>
            <div className="relative h-5">
              <div className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 rounded-full bg-(--color-dark-150)" />
              <div
                className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-(--color-primary-700)"
                style={{
                  left: `${((Math.min(sliderMin, sliderMax) - bounds.min) / span) * 100}%`,
                  right: `${100 - ((Math.max(sliderMin, sliderMax) - bounds.min) / span) * 100}%`,
                }}
              />
              <input
                type="range"
                min={bounds.min}
                max={bounds.max}
                value={Math.min(sliderMin, sliderMax)}
                aria-label={t('pages.catalog.minPrice')}
                className="catalog-range"
                onChange={(event) => setDragMin(Number(event.target.value))}
                onPointerUp={(event) => {
                  commitPrice(Number(event.currentTarget.value), maxValue);
                  setDragMin(null);
                }}
                onKeyUp={(event) => {
                  commitPrice(Number(event.currentTarget.value), maxValue);
                  setDragMin(null);
                }}
              />
              <input
                type="range"
                min={bounds.min}
                max={bounds.max}
                value={Math.max(sliderMin, sliderMax)}
                aria-label={t('pages.catalog.maxPrice')}
                className="catalog-range"
                onChange={(event) => setDragMax(Number(event.target.value))}
                onPointerUp={(event) => {
                  commitPrice(minValue, Number(event.currentTarget.value));
                  setDragMax(null);
                }}
                onKeyUp={(event) => {
                  commitPrice(minValue, Number(event.currentTarget.value));
                  setDragMax(null);
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-xs text-(--color-dark-400)">
                {t('pages.catalog.minPrice')}
                <input
                  ref={minInputRef}
                  inputMode="numeric"
                  value={minText}
                  className="h-10 rounded-lg border border-(--color-dark-200) px-3 text-sm text-(--color-dark-800) outline-none"
                  onChange={(event) =>
                    setPriceDraft({ key: priceKey, min: event.target.value, max: maxText })
                  }
                  onBlur={commitTextPrice}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      commitTextPrice();
                    }
                  }}
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-(--color-dark-400)">
                {t('pages.catalog.maxPrice')}
                <input
                  ref={maxInputRef}
                  inputMode="numeric"
                  value={maxText}
                  className="h-10 rounded-lg border border-(--color-dark-200) px-3 text-sm text-(--color-dark-800) outline-none"
                  onChange={(event) =>
                    setPriceDraft({ key: priceKey, min: minText, max: event.target.value })
                  }
                  onBlur={commitTextPrice}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      commitTextPrice();
                    }
                  }}
                />
              </label>
            </div>
          </>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        {sectionTitle(t('pages.catalog.sellers'), sections.sellers, () =>
          setSections((current) => ({ ...current, sellers: !current.sellers })),
        )}
        {sections.sellers ? (
          <>
            {sellers.map((seller) => (
              <label
                key={seller.id}
                className="flex items-center gap-2 py-1 text-sm text-(--color-dark-800)"
              >
                <input
                  type="checkbox"
                  className="size-4 accent-[#2459df]"
                  checked={query.sellers.includes(seller.id)}
                  onChange={() => toggleSeller(seller.id)}
                />
                <span className="min-w-0 flex-1 truncate">{seller.name}</span>
                <span className="text-(--color-dark-400)">{seller.count}</span>
              </label>
            ))}
            {filters.sellers.length > 3 && !showAllSellers ? (
              <button
                type="button"
                className="self-start text-sm font-medium text-(--color-primary-700)"
                onClick={() => setShowAllSellers(true)}
              >
                {t('pages.catalog.showAllSellers')}
              </button>
            ) : null}
          </>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        {sectionTitle(t('pages.catalog.location'), sections.place, () =>
          setSections((current) => ({ ...current, place: !current.place })),
        )}
        {sections.place ? (
          <>
            <div className="flex h-10 items-center rounded-lg border border-(--color-dark-200) px-3 text-sm text-(--color-dark-800)">
              {localized(location.city, i18n.language)}, {localized(location.region, i18n.language)}
            </div>
            {filters.delivery.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 py-1 text-sm text-(--color-dark-800)"
              >
                <input
                  type="checkbox"
                  className="size-4 accent-[#2459df]"
                  checked={query.delivery.includes(option.id)}
                  onChange={() => toggleDelivery(option.id)}
                />
                <span className="min-w-0 flex-1">
                  {option.id === 'delivery'
                    ? t('pages.catalog.delivery')
                    : t('pages.catalog.pickup')}
                </span>
                <span className="text-(--color-dark-400)">{option.count}</span>
              </label>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}

function FilterOption({
  label,
  count,
  selected,
  onClick,
}: {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm',
        selected
          ? 'bg-(--color-primary-100) font-medium text-(--color-primary-700)'
          : 'text-(--color-dark-800) hover:bg-(--color-primary-50)',
      )}
      onClick={onClick}
    >
      <span className="min-w-0 truncate">{label}</span>
      <span className={selected ? 'text-(--color-primary-700)' : 'text-(--color-dark-400)'}>
        {count}
      </span>
    </button>
  );
}
