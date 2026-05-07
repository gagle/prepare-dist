import { describe, expect, it } from 'vitest';
import { buildCapabilitiesReport, parsePackageVersion } from './capabilities';

describe('buildCapabilitiesReport', () => {
  const report = buildCapabilitiesReport();

  it('emits schemaVersion 1', () => {
    expect(report.schemaVersion).toBe(1);
  });

  it('identifies as prepare-dist', () => {
    expect(report.name).toBe('prepare-dist');
  });

  it('reads the version from package.json', () => {
    expect(report.version).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('lists the public features', () => {
    expect(report.features).toContain('transform');
    expect(report.features).toContain('verify-tag');
    expect(report.features).toContain('json-output');
    expect(report.features).toContain('plugins');
    expect(report.features).toContain('copy-metadata');
  });

  it('describes every flag with a type', () => {
    const flagNames = report.flags.map((flag) => flag.name);
    expect(flagNames).toEqual(
      expect.arrayContaining(['--path', '--dist', '--tag', '--json', '--capabilities', '--help']),
    );
    for (const flag of report.flags) {
      expect(['boolean', 'string']).toContain(flag.type);
    }
  });

  it('declares the JSON schemas it can emit', () => {
    const schemas = report.jsonSchemas.map((entry) => entry.schema);
    expect(schemas).toContain('PrepareDistReport');
    expect(schemas).toContain('CapabilitiesReport');
    for (const entry of report.jsonSchemas) {
      expect(entry.version).toBeGreaterThanOrEqual(1);
    }
  });

  it('publishes the exit-code catalog', () => {
    const codeNames = report.exitCodes.map((entry) => entry.name);
    expect(codeNames).toEqual(
      expect.arrayContaining([
        'SUCCESS',
        'GENERIC_FAILURE',
        'CONFIGURATION_ERROR',
        'MISSING_INPUTS',
        'TAG_MISMATCH',
        'TRANSFORM_FAILURE',
      ]),
    );
    expect(report.exitCodes.find((entry) => entry.name === 'SUCCESS')?.code).toBe(0);
  });
});

describe('parsePackageVersion', () => {
  it('extracts the version field', () => {
    expect(parsePackageVersion(JSON.stringify({ version: '1.2.3' }))).toBe('1.2.3');
  });

  it('falls back to "0.0.0" when JSON is malformed', () => {
    expect(parsePackageVersion('not-json')).toBe('0.0.0');
  });

  it('falls back to "0.0.0" when version field is missing', () => {
    expect(parsePackageVersion(JSON.stringify({ name: 'x' }))).toBe('0.0.0');
  });

  it('falls back to "0.0.0" when version is not a string', () => {
    expect(parsePackageVersion(JSON.stringify({ version: 42 }))).toBe('0.0.0');
  });

  it('falls back to "0.0.0" when JSON parses to a non-object (null)', () => {
    expect(parsePackageVersion('null')).toBe('0.0.0');
  });
});
