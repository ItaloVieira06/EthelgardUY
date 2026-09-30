import { describe, it, expect } from "vitest";
import {
  baseMana,
  currentMana,
  manaReservoirBonus,
  manaScaledByLevel,
  maxMana,
  totalMana,
} from "../rules/mana";

describe("base mana", () => {
  it("normal: (mana per level + presence) * level", () => {
    expect(baseMana("normal", 5, 3, 4)).toBe(32);
  });

  it("simplified: mana per level * level", () => {
    expect(baseMana("simplified", 5, 3, 4)).toBe(20);
  });

  it("ignores presence in the simplified mode", () => {
    expect(baseMana("simplified", 5, 0, 4)).toBe(baseMana("simplified", 5, 9, 4));
  });

  it("works at level 1 and level 20", () => {
    expect(baseMana("normal", 4, 2, 1)).toBe(6);
    expect(baseMana("normal", 4, 2, 20)).toBe(120);
  });
});

describe("mana reservoir talent", () => {
  it.each([
    [1, 5],
    [9, 5],
    [10, 10],
    [15, 10],
    [16, 15],
    [20, 15],
  ])("level %i gives +%i", (level, expected) => {
    expect(manaReservoirBonus(level)).toBe(expected);
  });
});

describe("level-scaled extras", () => {
  it("multiplies the value by the level", () => {
    expect(manaScaledByLevel(2, 10)).toBe(20);
    expect(manaScaledByLevel(1, 7)).toBe(7);
  });
});

describe("max mana", () => {
  const base = { mode: "normal" as const, manaPerLevel: 4, presence: 2, level: 10 };

  it("equals the base mana without extras", () => {
    expect(maxMana(base)).toBe(60);
  });

  it("adds each extra separately", () => {
    expect(maxMana({ ...base, reservoirBonus: manaReservoirBonus(10) })).toBe(70);
    expect(maxMana({ ...base, backgroundBonus: manaScaledByLevel(2, 10) })).toBe(80);
    expect(maxMana({ ...base, raceBonus: manaScaledByLevel(1, 10) })).toBe(70);
    expect(maxMana({ ...base, consumablesBonus: 3 })).toBe(63);
  });

  it("adds all extras together", () => {
    expect(
      maxMana({
        ...base,
        reservoirBonus: manaReservoirBonus(10),
        backgroundBonus: manaScaledByLevel(2, 10),
        raceBonus: manaScaledByLevel(1, 10),
        consumablesBonus: 3,
      })
    ).toBe(103);
  });

  it("works in the simplified mode", () => {
    expect(maxMana({ ...base, mode: "simplified", consumablesBonus: 3 })).toBe(43);
  });
});

describe("current and total mana", () => {
  it("current mana is max minus spent, never below 0", () => {
    expect(currentMana(60, 0)).toBe(60);
    expect(currentMana(60, 25)).toBe(35);
    expect(currentMana(60, 80)).toBe(0);
  });

  it("temporary mana is only added in the displayed total", () => {
    expect(totalMana(35, 5)).toBe(40);
    expect(totalMana(35, 0)).toBe(35);
  });

  it("temporary mana does not change the max mana", () => {
    const input = { mode: "normal" as const, manaPerLevel: 4, presence: 2, level: 10 };
    expect(maxMana(input)).toBe(60);
  });
});