import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Header } from '@/components/layout/Header';
import { I18nProvider } from '@/i18n/I18nProvider';

function renderHeader() {
  return render(
    <I18nProvider>
      <Header />
      <button type="button">Outside</button>
    </I18nProvider>,
  );
}

describe('Header', () => {
  it('opens the mega menu and closes it on Escape', async () => {
    const user = userEvent.setup();
    renderHeader();

    const trigger = screen.getByRole('button', { name: /всі категорії/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('header-mega-menu')).toBeTruthy();

    await user.keyboard('{Escape}');

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('header-mega-menu')).toBeNull();
  });

  it('closes the mega menu when clicking outside', async () => {
    const user = userEvent.setup();
    renderHeader();

    const trigger = screen.getByRole('button', { name: /всі категорії/i });
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens only one panel at a time', async () => {
    const user = userEvent.setup();
    renderHeader();

    const categories = screen.getByRole('button', { name: /всі категорії/i });
    const location = screen.getAllByRole('button', { name: /місто:/i })[0]!;

    await user.click(categories);
    expect(categories).toHaveAttribute('aria-expanded', 'true');

    await user.click(location);
    expect(location).toHaveAttribute('aria-expanded', 'true');
    expect(categories).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('header-mega-menu')).toBeNull();
    expect(document.getElementById('header-location-menu')).toBeTruthy();
  });

  it('updates the location button after a city is selected', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getAllByRole('button', { name: /місто: київ/i })[0]!);
    await user.click(screen.getByRole('button', { name: /боярка/i }));

    expect(screen.getAllByRole('button', { name: /місто: боярка/i }).length).toBeGreaterThan(0);
  });

  it('filters cities by search and shows an empty state', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getAllByRole('button', { name: /місто:/i })[0]!);
    const menu = document.getElementById('header-location-menu');
    expect(menu).toBeTruthy();

    const citySearch = within(menu!).getByRole('searchbox', { name: /почніть вводити/i });
    await user.type(citySearch, 'одеса');

    expect(within(menu!).getByRole('button', { name: /одеса/i })).toBeVisible();
    expect(within(menu!).queryByRole('button', { name: /кривий ріг/i })).not.toBeInTheDocument();

    await user.clear(citySearch);
    await user.type(citySearch, 'zzzzz');

    expect(within(menu!).getByText(/нічого не знайдено/i)).toBeVisible();
  });

  it('focuses search with Control+K', async () => {
    const user = userEvent.setup();
    renderHeader();

    const fields = screen.getAllByRole('searchbox', { name: /я шукаю/i });
    expect(fields.some((field) => field === document.activeElement)).toBe(false);

    await user.keyboard('{Control>}k{/Control}');

    expect(fields.some((field) => field === document.activeElement)).toBe(true);
  });
});
