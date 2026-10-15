import { Plus } from 'lucide-react';
export function MenuCard({ item, onAdd }) {
  return <article className="menu-card">
    <div className="card-image"><img src={item.image} alt={item.name} loading="lazy" />{item.tag && <span className="tag">{item.tag}</span>}</div>
    <div className="card-copy"><div className="card-heading"><h3>{item.name}</h3><strong>₹{item.price}</strong></div><p>{item.description}</p><button className="add-button" onClick={() => onAdd(item)} aria-label={`Add ${item.name} to cart`}><Plus size={16} /> Add</button></div>
  </article>;
}
