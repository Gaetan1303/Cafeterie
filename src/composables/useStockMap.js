// Fournit un mapping { type, subtype } => stockItem complet pour le front
import { ref, computed } from 'vue';
import { getStock } from '../utils/api';
import { useUserStore } from '../store/userStore';
import { useApiFetch } from './useApiFetch';

export function useStockMap() {
  const userStore = useUserStore();
  const { data: stockRaw, loading, error, fetchData } = useApiFetch(getStock, [userStore.token]);
  const stock = computed(() => Array.isArray(stockRaw.value) ? stockRaw.value : (stockRaw.value?.data || []));
  // Map: { type, subtype } => stockItem
  const stockMap = computed(() => {
    const map = {};
    for (const item of stock.value) {
      const key = item.type + '|' + (item.subtype || '');
      map[key] = item;
    }
    return map;
  });
  return { stock, stockMap, loading, error, fetchData };
}
