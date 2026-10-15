import { Check, Clock3, PackageCheck } from 'lucide-react';
const stages = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];
export function OrderTracker({ order, onDismiss }) {
  const current = stages.indexOf(order.status);
  return <div className="modal-backdrop"><section className="tracker-modal" role="dialog" aria-modal="true" aria-labelledby="tracker-title">
    <div className="tracker-top"><span className="eyebrow">ORDER #{order.id.slice(0, 8).toUpperCase()}</span><PackageCheck size={24}/></div>
    <h2 id="tracker-title">{order.status === 'Delivered' ? 'Delivered. Enjoy!' : 'We’re on it.'}</h2><p className="modal-intro">Thanks, {order.customer.name.split(' ')[0]}. Your order is being made with care.</p>
    <div className="progress-list">{stages.map((stage, index) => <div className={`progress-step ${index <= current ? 'complete' : ''} ${index === current ? 'current' : ''}`} key={stage}><div className="step-dot">{index < current ? <Check size={15}/> : index === current ? <Clock3 size={14}/> : null}</div><div><strong>{stage}</strong><small>{order.statusHistory.find((entry) => entry.status === stage)?.at ? new Date(order.statusHistory.find((entry) => entry.status === stage).at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : index === current ? 'Just now' : 'Up next'}</small></div></div>)}</div>
    <div className="tracker-total"><span>{order.items.reduce((sum, line) => sum + line.quantity, 0)} items · Total paid</span><strong>₹{order.total}</strong></div>
    <button className="checkout-button" onClick={onDismiss}>{order.status === 'Delivered' ? 'Back to the menu' : 'Keep browsing'} <span>→</span></button>
    <p className="live-note"><span/> Status updates automatically every few seconds</p>
  </section></div>;
}
