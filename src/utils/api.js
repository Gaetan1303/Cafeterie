
import { useErrorStore } from '../store/errorStore'

const API_BASE_URL = 'https://cafeterie-back.onrender.com';

class ApiClient {
  constructor(errorStore) {
    this.errorStore = errorStore;
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint, { method = 'GET', body, token } = {}) {
    const url = this.baseUrl + (endpoint.startsWith('/') ? endpoint : '/' + endpoint);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let lastError;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        });
        clearTimeout(timeout);
        if (!response.ok) {
          throw new Error(`Erreur API : ${response.status}`);
        }
        return response.json();
      } catch (e) {
        lastError = e;
        if (attempt === 0) await new Promise(r => setTimeout(r, 500));
      }
    }
    this.handleError(lastError);
    throw lastError;
  }

  handleError(error) {
    if (this.errorStore && typeof this.errorStore.setError === 'function') {
      this.errorStore.setError(error);
    }
  }

  // Méthodes métier (SRP)
  async useMachine(id, data, token) {
    return this.request(`/machines/${id}/use`, { method: 'POST', body: data, token });
  }
  async getProfile(token) {
    return this.request('/profile/me', { token });
  }
  async updateProfile(data, token) {
    return this.request('/profile/me', { method: 'PUT', body: data, token });
  }
  async getMyPurchases(token) {
    return this.request('/purchases/me', { token });
  }
  async createPurchase(data, token) {
    return this.request('/purchases', { method: 'POST', body: data, token });
  }
  async getRecentPurchases(token) {
    return this.request('/purchases/recent', { token });
  }
  async getEvents(token) {
    return this.request('/events', { token });
  }
  async getEvent(id, token) {
    return this.request(`/events/${id}`, { token });
  }
  async participateEvent(id, token) {
    return this.request(`/events/${id}/participate`, { method: 'POST', token });
  }
  async unparticipateEvent(id, token) {
    return this.request(`/events/${id}/unparticipate`, { method: 'POST', token });
  }
  async getMachines(token) {
    return this.request('/machines', { token });
  }
  async getMachine(id, token) {
    return this.request(`/machines/${id}`, { token });
  }
  async getStock(token) {
    return this.request('/stock', { token });
  }
  async getStockItem(id, token) {
    return this.request(`/stock/${id}`, { token });
  }
  async restockStockItem(id, quantity, token) {
    return this.request(`/stock/${id}/restock`, { method: 'POST', body: { quantity }, token });
  }
}


// Instance unique (Singleton, DIP)
export const apiClient = new ApiClient(useErrorStore());

// Pour compatibilité ascendante (remplacement progressif)
export const apiFetch = (...args) => apiClient.request(...args);
export const useMachine = (...args) => apiClient.useMachine(...args);
export const getProfile = (...args) => apiClient.getProfile(...args);
export const updateProfile = (...args) => apiClient.updateProfile(...args);
export const getMyPurchases = (...args) => apiClient.getMyPurchases(...args);
export const createPurchase = (...args) => apiClient.createPurchase(...args);
export const getRecentPurchases = (...args) => apiClient.getRecentPurchases(...args);
export const getEvents = (...args) => apiClient.getEvents(...args);
export const getEvent = (...args) => apiClient.getEvent(...args);
export const participateEvent = (...args) => apiClient.participateEvent(...args);
export const unparticipateEvent = (...args) => apiClient.unparticipateEvent(...args);
export const getMachines = (...args) => apiClient.getMachines(...args);
export const getMachine = (...args) => apiClient.getMachine(...args);
export const getStock = (...args) => apiClient.getStock(...args);
export const getStockItem = (...args) => apiClient.getStockItem(...args);
export const restockStockItem = (...args) => apiClient.restockStockItem(...args);



