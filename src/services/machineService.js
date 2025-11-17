// Service pour la logique de remplissage de machine
// Utilisable dans n'importe quel composant Vue

/**
 * Remplit une machine et retourne le nombre de tickets générés
 * @param {Object} machine - L'objet machine (doit avoir capacity, fillLevel, ticketPerUnit)
 * @param {number} amount - Quantité à remplir
 * @returns {Object} - { tickets: number, newFillLevel: number, filled: number }
 */
export function fillMachine(machine, amount) {
  const spaceLeft = machine.capacity - (machine.fillLevel || 0);
  const toFill = Math.max(0, Math.min(amount, spaceLeft));
  const tickets = toFill * (machine.ticketPerUnit || 1);
  const newFillLevel = (machine.fillLevel || 0) + toFill;
  return {
    tickets,
    newFillLevel,
    filled: toFill
  };
}
