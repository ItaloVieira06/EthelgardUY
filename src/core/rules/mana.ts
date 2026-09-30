// Base mana:
//   normal:     (class mana per level + presence) * level
//   simplified: class mana per level * level
//
// Extras added on top of the base (all optional):
//   reservoir talent, background, race, permanent points from consumables
//
// Temporary mana is NOT part of the max mana. It is a separate pool

import type { ManaMode } from "../schema/mana-mode";

export function baseMana(
  mode: ManaMode,
  manaPerLevel: number,
  presence: number,
  level: number
): number {
  const perLevel = mode === "normal" ? manaPerLevel + presence : manaPerLevel;
  return perLevel * level;
}

// Mana reservoir talent (optional): +5 up to level 9, +10 from 10 to 15, +15 from 16 to 20.
// Use this value only when the sheet has the talent.
export function manaReservoirBonus(level: number): number {
  if (level <= 9) return 5;
  if (level <= 15) return 10;
  return 15;
}

// For extras that scale with the level, such as a background giving level * 2
// or a race giving level * 1.
export function manaScaledByLevel(perLevel: number, level: number): number {
  return perLevel * level;
}

export interface ManaInput {
  mode: ManaMode;
  manaPerLevel: number; // from the class content (was: mana_nvl)
  presence: number;
  level: number;
  reservoirBonus?: number; // talent (manaReservoirBonus(level) when the sheet has it)
  backgroundBonus?: number; //level * 2 for some backgrounds
  raceBonus?: number; //level * 1 for some races
  consumablesBonus?: number; // permanent points from consumable items (editable)
}

export function maxMana({
  mode,
  manaPerLevel,
  presence,
  level,
  reservoirBonus = 0,
  backgroundBonus = 0,
  raceBonus = 0,
  consumablesBonus = 0,
}: ManaInput): number {
  return (
    baseMana(mode, manaPerLevel, presence, level) +
    reservoirBonus +
    backgroundBonus +
    raceBonus +
    consumablesBonus
  );
}

// Mana available from the recoverable pool
export function currentMana(max: number, spent: number): number {
  return Math.max(0, max - spent);
}

// Total shown to the player
export function totalMana(current: number, temporaryMana: number): number {
  return current + temporaryMana;
}