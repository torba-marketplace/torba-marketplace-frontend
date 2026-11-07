import type { Money } from '@/types/home';

const CURRENCY_SYMBOL: Record<Money['currency'], string> = {
  UAH: '₴',
};

function formatAmount(amount: number, locale: string): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? '-' : '';
  const digits = Math.abs(rounded).toString();
  const separator = locale.toLowerCase().startsWith('en') ? ',' : '\u00a0';

  return `${sign}${digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator)}`;
}

export function formatMoney(money: Money, locale = 'uk-UA'): string {
  const amount = formatAmount(money.amount, locale);
  const symbol = CURRENCY_SYMBOL[money.currency];

  return locale.toLowerCase().startsWith('en') ? `${symbol}${amount}` : `${amount}\u00a0${symbol}`;
}
