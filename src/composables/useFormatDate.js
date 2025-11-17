/**
 * Composable SOLID pour le formatage de date (SRP, OCP, ISP)
 * Usage :
 *   const { formatDate, formatDateTime } = useFormatDate()
 */
export function useFormatDate(locale = 'fr-FR', options = {}) {
  // Format date simple
  function formatDate(date, customOptions = {}) {
    if (!date) return ''
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit', ...options, ...customOptions })
  }
  // Format date + heure
  function formatDateTime(date, customOptions = {}) {
    if (!date) return ''
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleString(locale, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', ...options, ...customOptions })
  }
  return {
    formatDate,
    formatDateTime
  }
}
