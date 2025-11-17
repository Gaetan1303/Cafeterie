import { defineStore } from 'pinia';

// Persistance locale du store (localStorage)
function persistState(key, store) {
  const saved = localStorage.getItem(key);
  if (saved) {
    const data = JSON.parse(saved);
    if (data.token) store.token = data.token;
    if (data.user) store.user = data.user;
  }
  store.$subscribe((mutation, state) => {
    localStorage.setItem(key, JSON.stringify({ token: state.token, user: state.user }));
  });
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    user: null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    setUser(user) {
      this.user = user;
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('user');
    },
    persist() {
      persistState('user', this);
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user && state.user.role === 'admin',
  },
});
