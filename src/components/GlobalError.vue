<template>
  <div v-if="error" class="global-error">
    <div class="global-error__content">
      <h3>Une erreur est survenue</h3>
      <p>{{ error.message || error }}</p>
      <button @click="clearError">Fermer</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useErrorStore } from '../store/errorStore'

const errorStore = useErrorStore()
const error = ref(errorStore.error)

watch(() => errorStore.error, (val) => {
  error.value = val
})

function clearError() {
  errorStore.clearError()
}
</script>

<style scoped>
.global-error {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.global-error__content {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  text-align: center;
}
.global-error__content h3 {
  margin-bottom: 1rem;
}
.global-error__content button {
  margin-top: 1.5rem;
  padding: 0.5rem 1.5rem;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
