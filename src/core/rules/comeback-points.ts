export function comebackPoints(presence: number): number {
  if (presence <= 0) return 0;
  if (presence === 1) return 1;
  return Math.floor(presence / 2);
}
 
export function currentComebackPoints(base: number, modifier: number): number {
  return Math.max(0, base + modifier);
}