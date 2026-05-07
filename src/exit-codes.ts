export const EXIT = {
  SUCCESS: 0,
  GENERIC_FAILURE: 1,
  CONFIGURATION_ERROR: 10,
  MISSING_INPUTS: 30,
  TAG_MISMATCH: 40,
  TRANSFORM_FAILURE: 50,
} as const;

export type ExitCode = (typeof EXIT)[keyof typeof EXIT];
