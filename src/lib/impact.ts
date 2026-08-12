// Rough, clearly-labeled meals-equivalent conversion for donations not
// already posted in "meals"/"servings" units — same order-of-magnitude
// heuristic real food banks use (~0.5kg per meal). Always display this
// prefixed with "~" since it's an estimate, not a measured count.
const MEALS_PER_UNIT: Record<string, number> = {
  meals: 1,
  servings: 1,
  kg: 2,
  liters: 2,
};

export function estimateMeals(quantity: number, unit: string): number {
  const factor = MEALS_PER_UNIT[unit] ?? 1;
  return Math.round(quantity * factor);
}
