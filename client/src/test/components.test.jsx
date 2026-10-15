import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MenuCard } from '../components/MenuCard';
import { Cart } from '../components/Cart';
import { CheckoutModal } from '../components/CheckoutModal';

const item = { id: 'margherita', name: 'Margherita Pizza', description: 'Tomato, mozzarella, basil.', price: 329, image: 'pizza.jpg', tag: 'Popular' };

describe('MenuCard', () => {
  it('renders dish details and calls add handler', async () => {
    const onAdd = vi.fn(); const user = userEvent.setup();
    render(<MenuCard item={item} onAdd={onAdd}/>);
    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
    expect(screen.getByText('₹329')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add Margherita Pizza to cart' }));
    expect(onAdd).toHaveBeenCalledWith(item);
  });
});

describe('Cart', () => {
  it('calculates total and exposes quantity controls', async () => {
    const onChange = vi.fn(); const user = userEvent.setup();
    render(<Cart items={[{ item, quantity: 2 }]} onChange={onChange} onCheckout={vi.fn()}/>);
    expect(screen.getAllByText('₹658')).toHaveLength(3);
    await user.click(screen.getByRole('button', { name: 'Increase Margherita Pizza' }));
    expect(onChange).toHaveBeenCalledWith('margherita', 3);
  });
  it('shows the empty state before items are added', () => {
    render(<Cart items={[]} onChange={vi.fn()} onCheckout={vi.fn()}/>);
    expect(screen.getByText('Your bag is waiting')).toBeInTheDocument();
  });
});

describe('CheckoutModal', () => {
  it('requires customer, address, and phone details', () => {
    render(<CheckoutModal onClose={vi.fn()} onSubmit={vi.fn()} busy={false} error=""/>);
    expect(screen.getByLabelText('Full name')).toBeRequired();
    expect(screen.getByLabelText('Delivery address')).toBeRequired();
    expect(screen.getByLabelText('Phone number')).toBeRequired();
  });
});
