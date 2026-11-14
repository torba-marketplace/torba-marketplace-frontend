import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { CartPanel } from '@/components/cart/CartPanel';
import { mockCartItems, nonDiSeller } from '@/data/cart-mock';
import { I18nProvider } from '@/i18n/I18nProvider';
import {
  cartMoney,
  summarizeCart,
  withCartQuantity,
} from '@/lib/cart-summary';
import type { CartItem } from '@/types/cart';

function renderPanel(items: CartItem[], loading = false) {
  const onClose = vi.fn();
  const onQuantityChange = vi.fn();
  const onRemove = vi.fn();
  const onToggleSelected = vi.fn();

  render(
    <I18nProvider>
      <CartPanel
        loading={loading}
        items={items}
        onClose={onClose}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
        onToggleSelected={onToggleSelected}
      />
    </I18nProvider>,
  );

  return { onClose, onQuantityChange, onRemove, onToggleSelected };
}

describe('cart summary', () => {
  it('formats hryvnia with a thousands separator', () => {
    expect(cartMoney(32000)).toBe('₴32\u00a0000');
    expect(cartMoney(5999)).toBe('₴5\u00a0999');
  });

  it('sums only selected available items', () => {
    const filled = summarizeCart(mockCartItems());

    expect(filled.totalQuantity).toBe(2);
    expect(filled.payableQuantity).toBe(2);
    expect(filled.subtotal).toBe(77499);
    expect(filled.discount).toBe(39500);
    expect(filled.total).toBe(37999);

    const [laguna, bonro] = mockCartItems();
    const unavailable = summarizeCart([{ ...bonro, available: false, selected: false }, laguna]);

    expect(unavailable.payableQuantity).toBe(1);
    expect(unavailable.unavailableQuantity).toBe(1);
    expect(unavailable.subtotal).toBe(68500);
    expect(unavailable.discount).toBe(36500);
    expect(unavailable.total).toBe(32000);

    const unselected = summarizeCart([{ ...laguna, selected: false }, bonro]);

    expect(unselected.totalQuantity).toBe(2);
    expect(unselected.payableQuantity).toBe(1);
    expect(unselected.total).toBe(5999);
  });

  it('does not let quantity drop below 1', () => {
    const [laguna] = mockCartItems();
    const next = withCartQuantity([laguna], laguna.id, 0);

    expect(next[0]?.quantity).toBe(1);
    expect(withCartQuantity([laguna], laguna.id, 3)[0]?.quantity).toBe(3);
  });
});

describe('CartPanel', () => {
  it('shows skeletons while the cart is loading', () => {
    renderPanel(mockCartItems(), true);

    expect(screen.getByText('Завантажуємо ваш кошик…')).toBeInTheDocument();
    expect(screen.getByText('Уточнюємо ціни та наявність товарів')).toBeInTheDocument();
    expect(screen.queryByText('Крісло Лагуна')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Оформити замовлення' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Продовжити покупки' })).toBeDisabled();
  });

  it('shows grouped items and the payable total', () => {
    renderPanel(mockCartItems());

    expect(screen.getByRole('heading', { name: 'Кошик' })).toBeInTheDocument();
    expect(screen.getByText('2 товари')).toBeInTheDocument();
    expect(screen.getAllByText('CHARGE34').length).toBeGreaterThan(0);
    expect(screen.getByText('Крісло Лагуна')).toBeInTheDocument();
    expect(screen.getByText('Жовтий · вовна / дуб')).toBeInTheDocument();
    expect(screen.getByText(/37\s999/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Оформити замовлення' })).toHaveAttribute(
      'href',
      '/checkout',
    );
  });

  it('keeps the stepper at one and removes a line', async () => {
    const user = userEvent.setup();
    const { onQuantityChange, onRemove, onClose } = renderPanel(mockCartItems());

    expect(screen.getAllByRole('button', { name: 'Зменшити кількість' })[0]).toBeDisabled();

    await user.click(screen.getAllByRole('button', { name: 'Збільшити кількість' })[0]!);
    expect(onQuantityChange).toHaveBeenCalledWith('kreslo-laguna', 2);

    await user.click(screen.getByRole('button', { name: 'Видалити Крісло Лагуна' }));
    expect(onRemove).toHaveBeenCalledWith('kreslo-laguna');

    await user.click(screen.getByRole('button', { name: 'Продовжити покупки' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('warns about unavailable items and excludes them from the total', () => {
    const [laguna, bonro] = mockCartItems();

    renderPanel([laguna, { ...bonro, available: false, selected: false }]);

    expect(screen.getByText('Один товар уже недоступний')).toBeInTheDocument();
    expect(screen.getByText('Немає в наявності')).toBeInTheDocument();
    expect(screen.getByText('Не враховано в сумі')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Вибрати Крісло геймерське Bonro B-0519' })).toBeDisabled();
    expect(screen.getByText(/Сума без знижки \(1 товар\)/)).toBeInTheDocument();
    expect(screen.getByText(/36\s500/)).toBeInTheDocument();
  });

  it('splits lines from different sellers and ignores an unchecked line', () => {
    const [laguna, bonro] = mockCartItems();

    renderPanel([
      laguna,
      { ...bonro, seller: nonDiSeller, selected: false },
    ]);

    expect(screen.getAllByText('CHARGE34').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Non DI').length).toBeGreaterThan(0);
    expect(screen.getByText(/Сума без знижки \(1 товар\)/)).toBeInTheDocument();
    expect(screen.getByText('2 товари')).toBeInTheDocument();
  });

  it('shows the empty state', async () => {
    const user = userEvent.setup();
    const { onClose } = renderPanel([]);

    expect(screen.getByText('Ваш кошик поки порожній')).toBeInTheDocument();
    expect(screen.getByText('0 товарів')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Перейти в каталог' }));

    expect(onClose).toHaveBeenCalled();
    expect(screen.getByRole('link', { name: 'Перейти в каталог' })).toHaveAttribute('href', '/catalog');
  });
});
