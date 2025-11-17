// Validation utilitaire pour les formulaires (exemples)
export function validateName(name) {
  return typeof name === 'string' && /^[A-Za-zÀ-ÿ' -]{2,30}$/.test(name.trim());
}
export function validateEmail(email) {
  return typeof email === 'string' && /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email.trim());
}
export function validateQuantity(qty) {
  return typeof qty === 'number' && Number.isInteger(qty) && qty > 0 && qty <= 100;
}
export function validateType(type) {
  return ['cafe','the','nourriture'].includes(type);
}
export function validateSubtype(type, subtype) {
  if (type !== 'nourriture') return true;
  return ['gateau','viennoiserie','autre'].includes(subtype);
}
