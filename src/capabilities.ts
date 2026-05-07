import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CapabilitiesReport } from './interfaces/cli.interface';
import { EXIT } from './exit-codes';

export function buildCapabilitiesReport(): CapabilitiesReport {
  return {
    schemaVersion: 1,
    name: 'prepare-dist',
    version: readSelfVersion(),
    features: ['transform', 'copy-metadata', 'verify-tag', 'json-output', 'plugins'],
    flags: [
      { name: '--path', type: 'string' },
      { name: '--dist', type: 'string' },
      { name: '--tag', type: 'string' },
      { name: '--json', type: 'boolean' },
      { name: '--capabilities', type: 'boolean' },
      { name: '--help', type: 'boolean' },
    ],
    jsonSchemas: [
      { flag: '--json', schema: 'PrepareDistReport', version: 1 },
      { flag: '--capabilities --json', schema: 'CapabilitiesReport', version: 1 },
    ],
    exitCodes: [
      { code: EXIT.SUCCESS, name: 'SUCCESS' },
      { code: EXIT.GENERIC_FAILURE, name: 'GENERIC_FAILURE' },
      { code: EXIT.CONFIGURATION_ERROR, name: 'CONFIGURATION_ERROR' },
      { code: EXIT.MISSING_INPUTS, name: 'MISSING_INPUTS' },
      { code: EXIT.TAG_MISMATCH, name: 'TAG_MISMATCH' },
      { code: EXIT.TRANSFORM_FAILURE, name: 'TRANSFORM_FAILURE' },
    ],
  };
}

export function parsePackageVersion(content: string): string {
  try {
    const parsed: unknown = JSON.parse(content);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'version' in parsed &&
      typeof parsed.version === 'string'
    ) {
      return parsed.version;
    }
  } catch {
    // fall through
  }
  return '0.0.0';
}

function readSelfVersion(): string {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  const packageJsonPath = join(moduleDir, '..', 'package.json');
  return parsePackageVersion(readFileSync(packageJsonPath, 'utf-8'));
}
