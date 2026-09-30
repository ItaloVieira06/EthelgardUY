export const ATTRIBUTE_KEYS = [
  "strength",
  "agility",
  "vigor",
  "intelligence",
  "presence",
] as const;
 
export type AttributeKey = (typeof ATTRIBUTE_KEYS)[number];
export type Attributes = Record<AttributeKey, number>;