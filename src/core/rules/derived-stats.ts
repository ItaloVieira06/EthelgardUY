// Two kinds of bonus, as with skills:
//   baseBonus: raises the base value (comes from talents, through content grants)
//   extra:     editable by the player on the sheet (items, spells, events)

import type { AttributeKey, Attributes } from "../schema/attributes";

export const BASE_DEFENSE = 10; // without armor; armors can raise it
export const BASE_SAVE_DC = 8;
export const BASE_PASSIVE_PERCEPTION = 10;

//   defense = armorBase + armor attribute (agility by default)
//             + class attribute (only when NOT wearing armor, if the class has one)
//             + shieldBonus
export interface DefenseInput {
  attributes: Attributes;
  armorBase?: number; // 10 without armor; armors can raise it
  armorAttribute?: AttributeKey; // some armors use another attribute instead of agility
  wearingArmor?: boolean;
  classAttribute?: AttributeKey | null; // extra attribute some classes add when unarmored
  shieldBonus?: number;
}

export function defense({
  attributes,
  armorBase = BASE_DEFENSE,
  armorAttribute = "agility",
  wearingArmor = false,
  classAttribute = null,
  shieldBonus = 0,
}: DefenseInput): number {
  const classPart = !wearingArmor && classAttribute ? attributes[classAttribute] : 0;
  return armorBase + attributes[armorAttribute] + classPart + shieldBonus;
}

//   damageReduction = vigor + baseBonus + extra
export function damageReduction(vigor: number, baseBonus = 0, extra = 0): number {
  return vigor + baseBonus + extra;
}

//Each class uses one attribute, defined in the class content.
//   saveDc = 8 + proficiencyBonus + class attribute + baseBonus + extra
export function saveDc(
  proficiencyBonus: number,
  attributes: Attributes,
  saveAttribute: AttributeKey,
  baseBonus = 0,
  extra = 0
): number {
  return (
    BASE_SAVE_DC + proficiencyBonus + attributes[saveAttribute] + baseBonus + extra
  );
}

//   passivePerception = 10 + presence + perception skill total (0 if not owned) + baseBonus + extra
export function passivePerception(
  presence: number,
  perceptionSkillBonus: number,
  baseBonus = 0,
  extra = 0
): number {
  return (
    BASE_PASSIVE_PERCEPTION + presence + perceptionSkillBonus + baseBonus + extra
  );
}

export function comebackPoints(presence: number): number {
  if (presence <= 1) return 1;
  return Math.floor(presence / 2);
}
 
export function currentComebackPoints(base: number, modifier: number): number {
  return Math.max(0, base + modifier);
}