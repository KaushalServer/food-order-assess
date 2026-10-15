import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUpRight, ArrowUp,Clock3, Leaf, MapPin, Search, ShoppingBag, Sparkles, Utensils } from 'lucide-react';
import { api } from './api';
import { MenuCard } from './components/MenuCard';
import { Cart } from './components/Cart';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTracker } from './components/OrderTracker';

export default function App() {
  const [menu, setMenu] = useState([]); const [cart, setCart] = useState([]); const [category, setCategory] = useState('All');
  const [search, setSearch] = useState(''); const [checkoutOpen, setCheckoutOpen] = useState(false); const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [loadError, setLoadError] = useState('');
  useEffect(() => { api.getMenu().then((result) => setMenu(result.items)).catch(() => setLoadError('We couldn’t load the menu. Please refresh to try again.')); }, []);
  useEffect(() => {
    if (!order || order.status === 'Delivered') return undefined;
    const timer = setInterval(() => api.getOrder(order.id).then((result) => setOrder(result.order)).catch(() => {}), 4000);
    return () => clearInterval(timer);
  }, [order]);
  const categories = useMemo(() => ['All', ...new Set(menu.map((item) => item.category))], [menu]);
  const visible = menu.filter((item) => (category === 'All' || item.category === category) && `${item.name} ${item.description}`.toLowerCase().includes(search.toLowerCase()));
  const addItem = (item) => setCart((current) => { const exists = current.find((line) => line.item.id === item.id); return exists ? current.map((line) => line.item.id === item.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { item, quantity: 1 }]; });
  const changeQuantity = (id, quantity) => setCart((current) => quantity <= 0 ? current.filter((line) => line.item.id !== id) : current.map((line) => line.item.id === id ? { ...line, quantity: Math.min(quantity, 20) } : line));
  const placeOrder = async (delivery) => {
    setBusy(true); setError('');
    try { const result = await api.placeOrder({ ...delivery, items: cart.map(({ item, quantity }) => ({ itemId: item.id, quantity })) }); setOrder(result.order); setCart([]); setCheckoutOpen(false); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark"><Utensils size={17}/></span><span>crumb<span className="brand-amp">&</span>co.</span></a><nav><a href="#menu">Menu</a><a href="#story">Our story</a></nav><a className="top-order" href="#order"><ShoppingBag size={16}/><span>Your order</span>{cartCount > 0 && <b>{cartCount}</b>}</a></header>
    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/>GOOD FOOD, CLOSE BY</div><h1>A little joy,<br/>delivered <em>fresh.</em></h1><p>Made from scratch, picked with care, and brought right to your door. That’s the good stuff.</p><a href="#menu" className="hero-link">Find your favorites <span>↓</span></a><div className="hero-foot"><span><Clock3 size={15}/> 25–35 min delivery</span><span><MapPin size={15}/> Gurugram</span></div></div><div className="hero-image"><img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=90" alt="Freshly baked pizza on a wooden table"/><div className="image-stamp"><Sparkles size={16}/><span>Made with<br/><strong>the good stuff</strong></span></div><div className="image-caption">A table full of happy.</div></div></section>
      <section className="promise-strip" id="story"><div><span className="promise-icon"><Leaf size={18}/></span><span><strong>Fresh, always</strong><small>Good ingredients, no shortcuts</small></span></div><div><span className="promise-icon">✳</span><span><strong>Made to order</strong><small>From our kitchen to your table</small></span></div><div><span className="promise-icon"><ArrowUpRight size={18}/></span><span><strong>Local love</strong><small>Made right here in Gurugram</small></span></div></section>
      <section className="menu-layout" id="menu"><div className="menu-main"><div className="section-header"><div><div className="eyebrow">A FEW HOUSE FAVORITES</div><h2>Good things<br/>on the menu.</h2></div><div className="menu-aside">Simple ingredients.<br/>Really good food.</div></div>
        <div className="menu-controls"><div className="category-tabs" role="tablist" aria-label="Menu categories">{categories.map((name) => <button role="tab" aria-selected={category === name} className={category === name ? 'active' : ''} key={name} onClick={() => setCategory(name)}>{name}</button>)}</div><label className="search-box"><Search size={15}/><input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search menu" placeholder="Find something…"/></label></div>
        {loadError && <p role="alert" className="load-error">{loadError}</p>}<div className="menu-grid">{visible.map((item) => <MenuCard key={item.id} item={item} onAdd={addItem}/>)}{!visible.length && !loadError && <p>No dishes match that search.</p>}</div>
      </div><div id="order"><Cart items={cart} onChange={changeQuantity} onCheckout={() => { setError(''); setCheckoutOpen(true); }}/></div></section>
      <footer><a className="brand" href="#top"><span className="brand-mark"><Utensils size={15}/></span><span>crumb<span className="brand-amp">&</span>co.</span></a><span>Made fresh, shared happily. © 2026</span><a href="#top">Back to top <ArrowUp size={13}/></a></footer>
    </main>
    {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} onSubmit={placeOrder} busy={busy} error={error}/>}
    {order && <OrderTracker order={order} onDismiss={() => setOrder(null)}/>}
  </div>;
}
