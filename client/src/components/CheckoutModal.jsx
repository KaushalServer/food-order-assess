import { useState } from 'react';
import { X } from 'lucide-react';
export function CheckoutModal({ onClose, onSubmit, busy, error }) {
  const [form, setForm] = useState({ customer: '', address: '', phone: '' });
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event) => { event.preventDefault(); onSubmit(form); };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
    <button className="modal-close" onClick={onClose} aria-label="Close checkout"><X/></button><span className="eyebrow">ALMOST THERE</span><h2 id="checkout-title">Where should we<br/>bring the good stuff?</h2><p className="modal-intro">Add your delivery details and we’ll take it from here.</p>
    <form onSubmit={submit}>
      <label>Full name<input name="customer" value={form.customer} onChange={change} placeholder="Your name" minLength="2" maxLength="80" required /></label>
      <label>Delivery address<textarea name="address" value={form.address} onChange={change} placeholder="House / flat, street, area" minLength="8" maxLength="240" required /></label>
      <label>Phone number<input name="phone" type="tel" value={form.phone} onChange={change} placeholder="+91 98765 43210" pattern="\+?[0-9()\-\s]{8,20}" required /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="checkout-button" disabled={busy}>{busy ? 'Placing your order…' : 'Place my order'} <span>→</span></button>
    </form>
  </section></div>;
}
