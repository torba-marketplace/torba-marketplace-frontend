import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from '@/components/ui/Input';

describe('Input', () => {
  it('associates the error message with the field', () => {
    render(<Input label="Email" error="Вкажіть пошту" />);

    const field = screen.getByRole('textbox', { name: 'Email' });

    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAccessibleDescription('Вкажіть пошту');
  });

  it('reports each typed character', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Input aria-label="Пошук" onChange={onChange} />);

    await user.type(screen.getByRole('textbox', { name: 'Пошук' }), 'а');

    expect(onChange).toHaveBeenCalled();
  });
});
