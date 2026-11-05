import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Footer } from '@/components/layout/Footer';
import { I18nProvider } from '@/i18n/I18nProvider';

function renderFooter() {
  return render(
    <I18nProvider>
      <Footer />
    </I18nProvider>,
  );
}

describe('Footer', () => {
  it('links footer items with stub hrefs instead of inert buttons', () => {
    renderFooter();

    expect(screen.getByRole('link', { name: /категорії/i })).toHaveAttribute('href', '/catalog');
    expect(screen.getByRole('link', { name: /про компанію/i })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: /політика конфіденційності/i })).toHaveAttribute(
      'href',
      '/privacy',
    );
    expect(screen.getByRole('link', { name: /instagram/i })).toHaveAttribute(
      'href',
      expect.stringMatching(/^https?:/),
    );
    expect(screen.queryByRole('button', { name: /про компанію/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /україна · uah/i })).toBeVisible();
  });

  it('uses the current year and brand name in the copyright', () => {
    renderFooter();

    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${year} Torba`))).toBeVisible();
  });

  it('switches the language from the footer control', async () => {
    const user = userEvent.setup();
    renderFooter();

    await user.click(screen.getByRole('button', { name: /україна · uah/i }));
    await user.click(screen.getByRole('option', { name: 'English' }));

    expect(screen.getByRole('button', { name: /ukraine · uah/i })).toBeVisible();
    expect(screen.getByRole('heading', { name: /discover for yourself/i })).toBeVisible();
  });
});
