import { describe, expect, it } from 'vitest';
import { EXIT } from './exit-codes';

describe('EXIT', () => {
  it('exposes the structured exit-code constants', () => {
    expect(EXIT.SUCCESS).toBe(0);
    expect(EXIT.GENERIC_FAILURE).toBe(1);
    expect(EXIT.CONFIGURATION_ERROR).toBe(10);
    expect(EXIT.MISSING_INPUTS).toBe(30);
    expect(EXIT.TAG_MISMATCH).toBe(40);
    expect(EXIT.TRANSFORM_FAILURE).toBe(50);
  });

  it('contains exactly six unique codes', () => {
    const codes = Object.values(EXIT);
    expect(new Set(codes).size).toBe(codes.length);
    expect(codes).toHaveLength(6);
  });
});
