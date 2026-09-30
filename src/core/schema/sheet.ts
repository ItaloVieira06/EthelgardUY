export const ATTRIBUTE_KEYS = [
  "strength",
  "agility",
  "vigor",
  "intelligence",
  "presence",
] as const;

export type AttributeKey = (typeof ATTRIBUTE_KEYS)[number];
export type Attributes = Record<AttributeKey, number>;

export interface Inputs {
  // Identity
  name: string;
  family: string;
  age: number;
  weight: string;
  height: string;
  eyes: string;
  hair: string;
  skin: string;

  // Build choices (content IDs, not copied text)
  race: string;
  level: number; // 1 to 20, chosen when building the sheet (set by the game master)
  characterClass: string;
  subclass: string | null;
  background: string;
  attributes: Attributes;

  // Play state (the sheet stores what happened; current values are derived)
  damageTaken: number;
  manaSpent: number;
  temporaryHp: number;
  temporaryMana: number;
}

export interface Derived {
  proficiencyBonus: number;
  nucleusName: string;
  maxHp: number;
  currentHp: number;
  maxMana: number;
  currentMana: number;
  speed: string;
  attackBonus: number;
  saveDc: number;
  damageReduction: number;
  passivePerception: number;
}

export interface Sheet {
  schemaVersion: number;
  contentVersion: string;
  rulesVersion: string;
  id: string;
  meta: { createdAt: string; updatedAt: string };
  inputs: Inputs;
  overrides: Record<string, unknown>; // house rules (later)
}