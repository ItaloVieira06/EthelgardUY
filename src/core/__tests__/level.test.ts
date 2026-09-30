import { describe, it, expect } from "vitest";
import { proficiencyBonus, type Nucleus } from "../rules/level";
import tableJson from "../../content/nuclei.json";

const table = tableJson as Nucleus[];

describe("proficiency bonus", () => {
  it.each([[1, 2], [4, 3], [15, 6], [16, 7], [20, 10]])(
    "level %i gives +%i",
    (level: number, expected: number) => {
      expect(proficiencyBonus(level, table)).toBe(expected);
    }
  );
});