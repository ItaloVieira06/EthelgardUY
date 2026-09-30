import type { SkillKey } from "./skills";

export const ATTRIBUTE_KEYS = [
  "strength",
  "agility",
  "vigor",
  "intelligence",
  "presence",
] as const;

export type AttributeKey = (typeof ATTRIBUTE_KEYS)[number];
export type Attributes = Record<AttributeKey, number>;

export interface SkillInput {
  proficient: boolean; // owns the skill: adds the proficiency bonus
  trained: boolean; // doubles the skill value (only counts if proficient)
  bonusPoints: number; // points from items or events, outside the base (not doubled by training)
}

export interface ExternalBonuses {
  shield: number;
  difficultyTest: number; 
  damageReduction: number; 
  perception: number;
}

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
  level: number;
  characterClass: string;
  subclass: string | null;
  background: string;
  attributes: Attributes;
  skills: Partial<Record<SkillKey, SkillInput>>; // missing skill = not owned, no extras
  talents: string[]; // content IDs; permanent choices that change the base values

  // Play state (the sheet stores what happened; current values are derived)
  damageTaken: number;
  manaSpent: number;
  temporaryHp: number;
  temporaryMana: number;
  comebackPointsModifier: number;

  bonuses: ExternalBonuses;

  // TO CONFIRM:
  // vida_media, mana_nvl, p_vida, p_mana
}

export interface Derived {
  proficiencyBonus: number;
  nucleusName: string;
  proficiency: number;
  skillBonuses: Record<SkillKey, number>;
  maxHp: number;
  currentHp: number;
  maxMana: number;
  currentMana: number;
  speed: string;
  attackBonus: number;
  difficultyTest: number;
  comebackPoints: number;
  currentComebackPoints: number;
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