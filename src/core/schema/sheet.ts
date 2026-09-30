import type { Attributes } from "./attributes";
import type { SkillKey } from "./skills";

export interface SkillInput {
  proficient: boolean; // owns the skill: adds the proficiency bonus
  trained: boolean; // doubles the skill value (only counts if proficient)
  bonusPoints: number; // points from items or events, outside the base (not doubled by training)
}

// Base bonuses that raise the base value of a stat. They come from talents
// (through content grants), so the player does not edit them.
export interface BaseBonuses {
  damageReduction: number;
  saveDc: number;
  passivePerception: number;
}

// Bonuses from items and/or spells. The player edits them on the sheet;
// once the inventory exists, item bonuses can also be derived from equipped items.
export interface ExternalBonuses {
  shield: number;
  saveDc: number;
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
  level: number; // 1 to 20, chosen when building the sheet (set by the game master)
  characterClass: string;
  subclass: string | null;
  background: string;
  attributes: Attributes;
  skills: Partial<Record<SkillKey, SkillInput>>; // missing skill = not owned, no extras
  talents: string[]; // content IDs; permanent choices that change the base values

  // Play state (the sheet stores what happened; current values are derived)
  damageTaken: number;
  manaSpent: number;
  comebackPointsModifier: number; // net points during play: + granted by the game master, - spent

  // Bonuses from items and/or spells
  bonuses: ExternalBonuses;
  armorBase: number; // base of the defense: 10 without armor; armors can raise it

  // TO CONFIRM (meaning not defined yet, kept from the original list):
  // vida_media, mana_nvl, p_vida, p_mana
}

export interface Derived {
  proficiencyBonus: number;
  nucleusName: string;
  // Final bonus added to the die roll (attribute contribution still to be defined)
  skillBonuses: Record<SkillKey, number>;
  baseBonuses: BaseBonuses; // from talents, added to the base formulas
  maxHp: number;
  currentHp: number; // maxHp - damageTaken
  maxMana: number;
  currentMana: number; // maxMana - manaSpent
  speed: string;
  defense: number; //armor base + armor attribute + class attribute if unarmored + shield
  saveDc: number; 
  damageReduction: number; 
  passivePerception: number; 
  comebackPoints: number; // floor(presence / 2); 1 if presence is 1; 0 if presence is 0
  currentComebackPoints: number; // comebackPoints + comebackPointsModifier (minimum 0)
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