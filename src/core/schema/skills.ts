import type { AttributeKey } from "./sheet";

export const SKILLS_BY_ATTRIBUTE = {
  strength: ["athletics", "fighting"],
  agility: [
    "reflexes",
    "stealth",
    "marksmanship",
    "sleightOfHand",
    "piloting",
    "initiative",
  ],
  vigor: ["fortitude", "medicine", "profession", "willpower"],
  intelligence: [
    "investigation",
    "arcana",
    "science",
    "technology",
    "currentAffairs",
    "tactics",
    "nature",
    "survival",
    "insight",
    "history",
  ],
  presence: ["diplomacy", "intimidation", "perception", "religion", "deception"],
} as const satisfies Record<AttributeKey, readonly string[]>;

export type SkillKey =
  (typeof SKILLS_BY_ATTRIBUTE)[AttributeKey][number];

export const SKILL_KEYS = Object.values(SKILLS_BY_ATTRIBUTE).flat() as SkillKey[];

// Reverse lookup: which attribute each skill belongs to.
export const SKILL_ATTRIBUTE = Object.fromEntries(
  (Object.entries(SKILLS_BY_ATTRIBUTE) as [AttributeKey, readonly SkillKey[]][]).flatMap(
    ([attribute, skills]) => skills.map((skill) => [skill, attribute])
  )
) as Record<SkillKey, AttributeKey>;