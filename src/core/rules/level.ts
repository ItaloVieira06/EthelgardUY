export interface Nucleus {
  level: number;
  name: string;
  proficiencyBonus: number;
}

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 20;

export function nucleusForLevel(level: number, table: Nucleus[]): Nucleus {
  if (!Number.isInteger(level) || level < MIN_LEVEL || level > MAX_LEVEL) {
    throw new RangeError(
      `Invalid level: ${level}. Use an integer from ${MIN_LEVEL} to ${MAX_LEVEL}.`
    );
  }

  const nucleus = table.find((n) => n.level === level);
  if (!nucleus) {
    throw new Error(`Level ${level} not found in the nuclei table.`);
  }

  return nucleus;
}

export function proficiencyBonus(level: number, table: Nucleus[]): number {
  return nucleusForLevel(level, table).proficiencyBonus;
}