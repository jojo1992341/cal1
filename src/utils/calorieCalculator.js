import { MET_VALUES } from './metValues';

/**
 * Calcule les calories brûlées à vélo d'appartement selon la formule MET.
 * @param {Object} params - Données utilisateur.
 * @param {number} params.weight - Poids en kg.
 * @param {number} params.age - Âge.
 * @param {string} params.sex - Sexe ('H', 'F', 'A').
 * @param {number} params.duration - Durée de l'exercice en minutes.
 * @param {number} params.resistance - Niveau de résistance (1-10).
 * @returns {number} Calories brûlées (arrondi).
 */
export function calculateCalories({ weight, age, sex, duration, resistance }) {
  // 1. Déterminer le MET en fonction de la résistance
  const MET = MET_VALUES[resistance] || 6;
  // 2. Calcul de base MET
  let calories = ((MET * weight * 3.5) / 200) * duration;

  // 3. Ajustement selon le sexe (femmes = -7%, hommes = base, autre = -3%)
  if (sex === 'F') calories *= 0.93;
  else if (sex === 'A') calories *= 0.97;

  // 4. Ajustement optionnel selon l'âge (léger, car influence surtout le métabolisme de base)
  // (Réduction de 2% par décennie au-delà de 30 ans)
  if (age > 30) {
    const decades = Math.floor((age - 30) / 10);
    calories *= 1 - 0.02 * decades;
  }

  return Math.round(calories);
}
