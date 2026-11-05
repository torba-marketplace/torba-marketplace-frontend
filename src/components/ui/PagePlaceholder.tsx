type PagePlaceholderProps = {
  title: string;
  description: string;
};

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-3 py-16">
      <h1 className="max-w-xl text-display-sm font-semibold text-(--color-ink) sm:text-display-md">
        {title}
      </h1>
      <p className="max-w-lg text-md text-(--color-muted)">{description}</p>
    </div>
  );
}
