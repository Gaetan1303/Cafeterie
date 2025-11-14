// Utilitaire pour centraliser l'URL de l'API back-end


export const API_BASE_URL = 'https://cafeterie-back.onrender.com/';

// Exemple d'appel fetch
export async function apiFetch(endpoint, options = {}) {
  const url = API_BASE_URL.replace(/\/$/, '') + '/' + endpoint.replace(/^\//, '');
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }
  return response.json();
}

