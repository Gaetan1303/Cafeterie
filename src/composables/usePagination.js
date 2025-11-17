import { ref, computed } from 'vue'

/**
 * Composable SOLID pour la pagination locale (SRP, OCP, ISP)
 * Usage :
 *   const { page, pageSize, total, pageCount, paginatedItems, setPage, setPageSize, setTotal } = usePagination(items)
 */
export function usePagination(itemsRef, initialPageSize = 10) {
  const page = ref(1)
  const pageSize = ref(initialPageSize)
  const total = ref(0)

  // Calcul du nombre de pages
  const pageCount = computed(() => Math.ceil(total.value / pageSize.value) || 1)

  // Items paginés (dépend de itemsRef)
  const paginatedItems = computed(() => {
    const items = Array.isArray(itemsRef.value) ? itemsRef.value : []
    total.value = items.length
    const start = (page.value - 1) * pageSize.value
    return items.slice(start, start + pageSize.value)
  })

  // Méthodes explicites (OCP, ISP)
  function setPage(newPage) {
    if (newPage >= 1 && newPage <= pageCount.value) page.value = newPage
  }
  function setPageSize(newSize) {
    if (newSize > 0) pageSize.value = newSize
    page.value = 1
  }
  function setTotal(newTotal) {
    total.value = newTotal
  }

  return {
    page,
    pageSize,
    total,
    pageCount,
    paginatedItems,
    setPage,
    setPageSize,
    setTotal
  }
}
