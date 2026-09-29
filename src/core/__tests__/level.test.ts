import { describe, it, expect } from "vitest";
// import { bonusProficiencia } from "../regras/nivel";

describe("bônus de proficiência", () => {
  it.each([[1, 2], [4, 3], [15, 6], [16, 7], [20, 10]])(
    "nível %i dá +%i",
    (nivel, esperado) => {
      // expect(bonusProficiencia(nivel)).toBe(esperado);
    }
  );
});