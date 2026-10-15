const API_URL = import.meta.env.VITE_API_URL || '/api';
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers } });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Something went wrong. Please try again.');
  }
  return response.status === 204 ? null : response.json();
}
export const api = {
  getMenu: () => request('/menu'),
  placeOrder: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrder: (id) => request(`/orders/${id}`)
};
