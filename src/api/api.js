// Update with your actual Render backend URL once deployed, or set it in environment variables as REACT_APP_API_URL.
const BASE_URL = process.env.REACT_APP_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : 'https://tribal-store-1.onrender.com/api');

function authHeaders() {
  const token = localStorage.getItem('tribal_token');
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
}

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Server error');
  return data;
}

const api = {
  // Products
  getProducts: (category) =>
    request('GET', `/products${category ? `?category=${category}` : ''}`),
  getProduct: (id) => request('GET', `/products/${id}`),
  addProduct: (data) => request('POST', '/products', data),
  approveProduct: (id) => request('PUT', `/products/${id}/approve`),
  getPendingProducts: () => request('GET', '/products/pending/all'),

  // Artisans
  getArtisans: () => request('GET', '/artisans'),
  getArtisan: (id) => request('GET', `/artisans/${id}`),
  approveArtisan: (id) => request('PUT', `/artisans/${id}/approve`),
  getPendingArtisans: () => request('GET', '/artisans/pending/all'),

  // Users
  register: (data) => request('POST', '/users/register', data),
  login: (data) => request('POST', '/users/login', data),
  loginWithGoogle: (credential) => request('POST', '/users/google-login', { credential }),
  loginWithMockGoogle: (email) => request('POST', '/users/mock-google-login', { email }),
  getProfile: () => request('GET', '/users/profile'),


  // Cart
  getCart: () => request('GET', '/cart'),
  addToCart: (data) => request('POST', '/cart', data),
  updateCart: (productId, data) => request('PUT', `/cart/${productId}`, data),
  clearCart: () => request('DELETE', '/cart'),

  // Orders
  getOrders: () => request('GET', '/orders'),
  createOrder: (data) => request('POST', '/orders', data),

  // Reviews
  getReviews: (productId) => request('GET', `/reviews/${productId}`),
  addReview: (data) => request('POST', '/reviews', data),

  // Analytics (admin)
  getAnalyticsSummary: () => request('GET', '/analytics/summary'),
  getDisputes: () => request('GET', '/analytics/disputes'),
  getActivityUsers: () => request('GET', '/analytics/users'),


  // Seller analytics
  getSellerSummary: () => request('GET', '/seller/summary'),
  getArtisanOrders: () => request('GET', '/seller/orders'),

  // Heritage (consultant/admin)
  getHeritageQueue: () => request('GET', '/heritage/queue'),
  getHeritageArchive: () => request('GET', '/heritage/archive'),
  saveHeritageStory: (data) => request('POST', '/heritage/story', data),
};

export default api;
