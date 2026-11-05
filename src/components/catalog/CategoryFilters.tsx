type CategoryFilter = {
  value: string;
  label: string;
};

type CategoryFiltersProps = {
  categories: CategoryFilter[];
  allLabel: string;
  label: string;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
};

export function CategoryFilters({
  categories,
  allLabel,
  label,
  selectedCategory,
  onSelectCategory,
}: CategoryFiltersProps) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={selectedCategory === null}
        className={
          selectedCategory === null
            ? 'rounded-full bg-(--color-brand) px-4 py-2 text-sm font-medium text-white'
            : 'rounded-full bg-white px-4 py-2 text-sm font-medium text-(--color-ink) ring-1 ring-(--color-dark-200)'
        }
        onClick={() => onSelectCategory(null)}
      >
        {allLabel}
      </button>

      {categories.map((category) => (
        <button
          key={category.value}
          type="button"
          aria-pressed={selectedCategory === category.value}
          className={
            selectedCategory === category.value
              ? 'rounded-full bg-(--color-brand) px-4 py-2 text-sm font-medium text-white'
              : 'rounded-full bg-white px-4 py-2 text-sm font-medium text-(--color-ink) ring-1 ring-(--color-dark-200)'
          }
          onClick={() => onSelectCategory(category.value)}
        >
          {category.label}
        </button>
      ))}
    </nav>
  );
}
