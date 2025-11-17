import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useErrorStore = defineStore('error', () => {
  const error = ref(null)

  function setError(err) {
    if (typeof err === 'string') {
      error.value = { message: err }
    } else if (err && err.message) {
      error.value = err
    } else {
      error.value = { message: 'Erreur inconnue' }
    }
  }

  function clearError() {
    error.value = null
  }

  return { error, setError, clearError }
})
