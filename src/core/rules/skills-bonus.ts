import type { SkillInput } from "../schema/sheet";
import { SKILL_KEYS, type SkillKey } from "../schema/skills";

const DEFAULT_SKILL: SkillInput = {
  proficient: false,
  trained: false,
  bonusPoints: 0,
};

// Skills where training adds a flat value instead of doubling.
const FLAT_TRAINING_BONUS: Partial<Record<SkillKey, number>> = {
  fighting: 2,
  marksmanship: 2,
  arcana: 2,
  religion: 2,
};

export function skillBonus(
  skill: SkillKey,
  input: SkillInput | undefined,
  proficiencyBonus: number,
  talentPoints = 0
): number {
  const { proficient, trained, bonusPoints } = input ?? DEFAULT_SKILL;
  const base = (proficient ? proficiencyBonus : 0) + talentPoints;

  let afterTraining = base;
  if (proficient && trained) {
    const flat = FLAT_TRAINING_BONUS[skill];
    afterTraining = flat !== undefined ? base + flat : base * 2;
  }

  return afterTraining + bonusPoints;
}

export function computeSkillBonuses(
  skills: Partial<Record<SkillKey, SkillInput>>,
  proficiencyBonus: number,
  talentPoints: Partial<Record<SkillKey, number>> = {}
): Record<SkillKey, number> {
  return Object.fromEntries(
    SKILL_KEYS.map((key) => [
      key,
      skillBonus(key, skills[key], proficiencyBonus, talentPoints[key] ?? 0),
    ])
  ) as Record<SkillKey, number>;
}