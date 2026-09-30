import { describe, it, expect } from "vitest";
import {
  damageReduction,
  defense,
  passivePerception,
  saveDc,
  comebackPoints, 
  currentComebackPoints
} from "../rules/derived-stats";
import type { Attributes } from "../schema/attributes";

const attributes: Attributes = {
  strength: 1,
  agility: 2,
  vigor: 3,
  intelligence: 4,
  presence: 5,
};

describe("defense", () => {
  it("is 10 + agility without armor or shield", () => {
    expect(defense({ attributes })).toBe(12);
  });

  it("uses the armor base instead of 10", () => {
    expect(defense({ attributes, armorBase: 12, wearingArmor: true })).toBe(14);
  });

  it("adds the shield bonus", () => {
    expect(
      defense({ attributes, armorBase: 12, wearingArmor: true, shieldBonus: 2 })
    ).toBe(16);
  });

  it("uses another attribute instead of agility when the armor asks for it", () => {
    expect(
      defense({
        attributes,
        armorBase: 12,
        armorAttribute: "vigor",
        wearingArmor: true,
      })
    ).toBe(15);
  });

  it("adds the class attribute when not wearing armor", () => {
    expect(defense({ attributes, classAttribute: "vigor" })).toBe(15);
  });

  it("ignores the class attribute when wearing armor", () => {
    expect(
      defense({
        attributes,
        armorBase: 12,
        wearingArmor: true,
        classAttribute: "vigor",
      })
    ).toBe(14);
  });

  it("combines class attribute and shield when unarmored", () => {
    expect(
      defense({ attributes, classAttribute: "vigor", shieldBonus: 1 })
    ).toBe(16);
  });
});

describe("damage reduction", () => {
  it("equals vigor", () => {
    expect(damageReduction(attributes.vigor)).toBe(3);
  });

  it("adds the base bonus from talents", () => {
    expect(damageReduction(attributes.vigor, 1)).toBe(4);
  });

  it("adds the extra reduction edited by the player", () => {
    expect(damageReduction(attributes.vigor, 0, 2)).toBe(5);
  });

  it("adds both bonuses", () => {
    expect(damageReduction(attributes.vigor, 1, 2)).toBe(6);
  });
});

describe("save DC", () => {
  it("is 8 + proficiency + the class attribute", () => {
    expect(saveDc(4, attributes, "intelligence")).toBe(16);
    expect(saveDc(4, attributes, "presence")).toBe(17);
    expect(saveDc(2, attributes, "strength")).toBe(11);
  });

  it("adds the base bonus from talents", () => {
    expect(saveDc(4, attributes, "intelligence", 1)).toBe(17);
  });

  it("adds the extra bonus edited by the player", () => {
    expect(saveDc(4, attributes, "intelligence", 0, 2)).toBe(18);
  });

  it("adds both bonuses", () => {
    expect(saveDc(4, attributes, "intelligence", 1, 2)).toBe(19);
  });
});

describe("passive perception", () => {
  it("is 10 + presence + perception skill total", () => {
    expect(passivePerception(attributes.presence, 4)).toBe(19);
  });

  it("works without the perception skill", () => {
    expect(passivePerception(attributes.presence, 0)).toBe(15);
  });

  it("adds the base bonus from talents", () => {
    expect(passivePerception(attributes.presence, 4, 1)).toBe(20);
  });

  it("adds the extra bonus edited by the player", () => {
    expect(passivePerception(attributes.presence, 4, 0, 2)).toBe(21);
  });

  it("adds both bonuses", () => {
    expect(passivePerception(attributes.presence, 4, 1, 2)).toBe(22);
  });
});

describe("comeback points", () => {
  it.each([
    [0, 0],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 2],
    [5, 2],
    [6, 3],
    [7, 3],
    [10, 5],
  ])("presence %i gives %i", (presence, expected) => {
    expect(comebackPoints(presence)).toBe(expected);
  });

  it("never returns a negative value", () => {
    expect(comebackPoints(-1)).toBe(0);
  });
});

describe("current comeback points", () => {
  it("equals the base when the modifier is 0", () => {
    expect(currentComebackPoints(3, 0)).toBe(3);
  });

  it("adds points granted by the game master (positive modifier)", () => {
    expect(currentComebackPoints(3, 2)).toBe(5);
  });

  it("subtracts spent points (negative modifier)", () => {
    expect(currentComebackPoints(3, -2)).toBe(1);
  });

  it("never goes below zero", () => {
    expect(currentComebackPoints(1, -3)).toBe(0);
  });
});