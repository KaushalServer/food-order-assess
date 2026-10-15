import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
export function Cart({ items, onChange, onCheckout }) {
  const subtotal = items.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
  const fee = subtotal >= 499 || subtotal === 0 ? 0 : 39;
  return <section className="cart-panel" aria-label="Your order">
    <div className="panel-title"><div><span className="eyebrow">YOUR ORDER</span><h2>Good things<br/>in the bag.</h2></div><ShoppingBag size={22}/></div>
    {!items.length ? <div className="empty-cart"><div className="empty-icon"><ShoppingBag size={22}/></div><strong>Your bag is waiting</strong><span>Add something delicious to get started.</span></div> : <>
      <div className="cart-lines">{items.map(({ item, quantity }) => <div className="cart-line" key={item.id}><div className="line-copy"><strong>{item.name}</strong><span>₹{item.price} each</span></div><div className="quantity-controls"><button aria-label={`Decrease ${item.name}`} onClick={() => onChange(item.id, quantity - 1)}><Minus size={13}/></button><span>{quantity}</span><button aria-label={`Increase ${item.name}`} onClick={() => onChange(item.id, quantity + 1)}><Plus size={13}/></button><button className="remove" aria-label={`Remove ${item.name}`} onClick={() => onChange(item.id, 0)}><Trash2 size={14}/></button></div><strong className="line-total">₹{item.price * quantity}</strong></div>)}</div>
      <div className="cost-lines"><div><span>Subtotal</span><span>₹{subtotal}</span></div><div><span>Delivery</span><span>{fee === 0 ? 'FREE' : `₹${fee}`}</span></div><div className="total-line"><strong>Total</strong><strong>₹{subtotal + fee}</strong></div></div>
      <button className="checkout-button" onClick={onCheckout}>Continue to checkout <span>→</span></button>
      <p className="delivery-note">Free delivery on orders over ₹499</p>
    </>}
  </section>;
}
