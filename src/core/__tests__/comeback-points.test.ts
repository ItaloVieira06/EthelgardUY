import { describe, it, expect } from "vitest";
import { comebackPoints, currentComebackPoints } from "../rules/comeback-points";

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