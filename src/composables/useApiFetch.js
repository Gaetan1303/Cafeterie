import { ref } from 'vue'
import { useLoaderStore } from '../store/loaderStore';

/**
 * Composable SOLID pour la gestion des appels API (SRP, OCP, ISP, DIP)
 * Usage :
 *   const { data, loading, error, fetchData } = useApiFetch(apiFn, ...args)
 *   fetchData() // ou autoFetch: true
 */
export function useApiFetch(apiFn, args = [], options = { autoFetch: true }) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchData(...overrideArgs) {
    loading.value = true
    error.value = null
    const loaderStore = useLoaderStore();
    loaderStore.show();
    try {
      // On permet d'override les args à la volée
      const result = await apiFn(...(overrideArgs.length ? overrideArgs : args))
      data.value = result
      return result
    } catch (err) {
      error.value = err
      data.value = null
      return null
    } finally {
      loading.value = false
      loaderStore.hide();
    }
  }

  if (options.autoFetch) {
    fetchData()
  }

  return {
    data,
    loading,
    error,
    fetchData
  }
}
