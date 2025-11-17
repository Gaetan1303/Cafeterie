import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toast = reactive({
    visible: false,
    message: '',
    type: 'success', // 'success' | 'error'
    timeoutId: null
  });

  function showToast(message, type = 'success', duration = 3000) {
    toast.message = message;
    toast.type = type;
    toast.visible = true;
    if (toast.timeoutId) clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(() => hideToast(), duration);
  }

  function hideToast() {
    toast.visible = false;
    toast.message = '';
    toast.type = 'success';
    if (toast.timeoutId) clearTimeout(toast.timeoutId);
    toast.timeoutId = null;
  }

  return { toast, showToast, hideToast };
});
