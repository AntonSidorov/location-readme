import { filterOutFalsy } from './type.functions';

describe('Type functions', () => {
  it('should return false for falsy values', () => {
    expect(filterOutFalsy(false)).toBe(false);
    expect(filterOutFalsy(0)).toBe(false);
    expect(filterOutFalsy('')).toBe(false);
    expect(filterOutFalsy(undefined)).toBe(false);
    expect(filterOutFalsy(null)).toBe(false);
    expect(filterOutFalsy(NaN)).toBe(false);
  });
  it('should return true for truthy values', () => {
    expect(filterOutFalsy(true)).toBe(true);
    expect(filterOutFalsy(-2)).toBe(true);
    expect(filterOutFalsy(5)).toBe(true);
    expect(filterOutFalsy('string')).toBe(true);
    expect(filterOutFalsy("other string's with apostrophe")).toBe(true);
    expect(filterOutFalsy({})).toBe(true);
    expect(filterOutFalsy([])).toBe(true);
  });
});
