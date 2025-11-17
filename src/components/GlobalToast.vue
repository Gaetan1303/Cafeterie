<template>
  <div v-if="toast.visible" :class="['global-toast', toast.type]">
    <span>{{ toast.message }}</span>
    <button @click="closeToast">×</button>
  </div>
</template>

<script setup>
import { useToastStore } from '../store/toastStore';
const toastStore = useToastStore();
const toast = toastStore.toast;
function closeToast() {
  toastStore.hideToast();
}
</script>

<style scoped>
.global-toast {
  position: fixed;
  z-index: 9999;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  min-width: 220px;
  max-width: 90vw;
  background: #222;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px #0005;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  animation: fadein 0.2s;
}
.global-toast.success { background: #27ae60; }
.global-toast.error { background: #e74c3c; }
.global-toast button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.3rem;
  cursor: pointer;
  margin-left: 1rem;
}
@keyframes fadein {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>
