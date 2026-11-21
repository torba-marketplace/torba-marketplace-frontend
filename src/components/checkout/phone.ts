export function isOrderPhone(value: string) {
  const digits = value.replace(/\D/g, '');

  return /^(?:380\d{9}|0\d{9})$/.test(digits);
}

export function formatUaPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  const national = (digits.startsWith('380') ? digits.slice(3) : digits.replace(/^0/, '')).slice(0, 9);

  if (!national) {
    return value.trim();
  }

  const parts = [
    national.slice(0, 2),
    national.slice(2, 5),
    national.slice(5, 7),
    national.slice(7, 9),
  ].filter(Boolean);

  return `+380 ${parts.join(' ')}`;
}
