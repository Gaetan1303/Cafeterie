// Utilitaire pour centraliser l'URL de l'API back-end


export const API_BASE_URL = 'https://cafeterie-back.onrender.com/';


// Exemple d'appel fetch
export async function apiFetch(endpoint, { method = 'GET', body, token } = {}) {
  const url = API_BASE_URL.replace(/\/$/, '') + '/' + endpoint.replace(/^\//, '');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }
  return response.json();
}

// --- PROFIL ---
export async function getProfile(token) {
  return apiFetch('/profile/me', { token });
}
export async function updateProfile(data, token) {
  return apiFetch('/profile/me', { method: 'PUT', body: data, token });
}

// --- ACHATS ---
export async function getMyPurchases(token) {
  return apiFetch('/purchases/me', { token });
}
export async function createPurchase(data, token) {
  return apiFetch('/purchases', { method: 'POST', body: data, token });
}
export async function getRecentPurchases(token) {
  return apiFetch('/purchases/recent', { token });
}

// --- EVENEMENTS ---
export async function getEvents(token) {
  return apiFetch('/events', { token });
}
export async function getEvent(id, token) {
  return apiFetch(`/events/${id}`, { token });
}
export async function participateEvent(id, token) {
  return apiFetch(`/events/${id}/participate`, { method: 'POST', token });
}
export async function unparticipateEvent(id, token) {
  return apiFetch(`/events/${id}/unparticipate`, { method: 'POST', token });
}

// --- MACHINES ---
export async function getMachines(token) {
  return apiFetch('/machines', { token });
}
export async function getMachine(id, token) {
  return apiFetch(`/machines/${id}`, { token });
}

// --- STOCK ---
export async function getStock(token) {
  return apiFetch('/stock', { token });
}
export async function getStockItem(id, token) {
  return apiFetch(`/stock/${id}`, { token });
}

