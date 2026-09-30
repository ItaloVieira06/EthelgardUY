import { describe, it, expect } from "vitest";
import { computeSkillBonuses, skillBonus } from "../rules/skills-bonus";
import { SKILL_KEYS, type SkillKey } from "../schema/skills";

const PROFICIENCY = 4; // e.g. levels 7 to 9

const owned = { proficient: true, trained: false, bonusPoints: 0 };
const notOwned = { proficient: false, trained: false, bonusPoints: 0 };

describe("skill bonus (regular skill: athletics)", () => {
  it("is 0 when the skill is not owned and has no extra points", () => {
    expect(skillBonus("athletics", undefined, PROFICIENCY)).toBe(0);
    expect(skillBonus("athletics", notOwned, PROFICIENCY)).toBe(0);
  });

  it("adds the proficiency bonus when the skill is owned", () => {
    expect(skillBonus("athletics", owned, PROFICIENCY)).toBe(4);
  });

  it("adds talent points to the base", () => {
    expect(skillBonus("athletics", owned, PROFICIENCY, 1)).toBe(5);
  });

  it("applies talent points even without owning the skill", () => {
    expect(skillBonus("athletics", notOwned, PROFICIENCY, 1)).toBe(1);
  });

  it("adds item and event points on top", () => {
    expect(skillBonus("athletics", { ...owned, bonusPoints: 2 }, PROFICIENCY)).toBe(6);
    expect(skillBonus("athletics", { ...notOwned, bonusPoints: 3 }, PROFICIENCY)).toBe(3);
  });

  it("doubles the base when the skill is trained", () => {
    expect(skillBonus("athletics", { ...owned, trained: true }, PROFICIENCY)).toBe(8);
  });

  it("includes talent points in the doubled base", () => {
    expect(skillBonus("athletics", { ...owned, trained: true }, PROFICIENCY, 1)).toBe(10);
  });

  it("does not double item and event points", () => {
    expect(
      skillBonus("athletics", { ...owned, trained: true, bonusPoints: 2 }, PROFICIENCY, 1)
    ).toBe(12);
  });

  it("ignores training when the skill is not owned", () => {
    expect(skillBonus("athletics", { ...notOwned, trained: true }, PROFICIENCY)).toBe(0);
    expect(skillBonus("athletics", { ...notOwned, trained: true }, PROFICIENCY, 1)).toBe(1);
  });
});

describe("skills with flat training bonus", () => {
  const flatSkills: SkillKey[] = ["fighting", "marksmanship", "arcana", "religion"];

  it.each(flatSkills)("%s: training adds +2 instead of doubling", (skill) => {
    expect(skillBonus(skill, { ...owned, trained: true }, PROFICIENCY)).toBe(6);
  });

  it("keeps talent points in the base and adds the flat +2", () => {
    expect(skillBonus("fighting", { ...owned, trained: true }, PROFICIENCY, 1)).toBe(7);
  });

  it("adds item and event points on top", () => {
    expect(
      skillBonus("fighting", { ...owned, trained: true, bonusPoints: 2 }, PROFICIENCY, 1)
    ).toBe(9);
  });

  it("gives no training bonus when the skill is not owned", () => {
    expect(skillBonus("fighting", { ...notOwned, trained: true }, PROFICIENCY)).toBe(0);
  });

  it("without training, behaves like any other owned skill", () => {
    expect(skillBonus("fighting", owned, PROFICIENCY)).toBe(4);
  });
});

describe("compute skill bonuses", () => {
  it("returns a value for every skill", () => {
    const bonuses = computeSkillBonuses({}, PROFICIENCY);
    expect(Object.keys(bonuses)).toHaveLength(SKILL_KEYS.length);
    expect(SKILL_KEYS).toHaveLength(27);
  });

  it("uses each skill's own input, talent points and training rule", () => {
    const bonuses = computeSkillBonuses(
      {
        athletics: { proficient: true, trained: true, bonusPoints: 0 },
        fighting: { proficient: true, trained: true, bonusPoints: 0 },
        stealth: { proficient: true, trained: false, bonusPoints: 1 },
      },
      PROFICIENCY,
      { athletics: 1 }
    );
    expect(bonuses.athletics).toBe(10);
    expect(bonuses.fighting).toBe(6);
    expect(bonuses.stealth).toBe(5);
    expect(bonuses.reflexes).toBe(0);
  });
});