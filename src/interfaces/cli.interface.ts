export interface CliOptions {
  readonly path?: string;
  readonly dist?: string;
  readonly tag?: string;
  readonly json?: boolean;
  readonly capabilities?: boolean;
}

export interface VerifyTagReport {
  readonly tag: string;
  readonly version: string;
  readonly packageVersion: string;
  readonly matches: boolean;
}

export interface TransformPackageReport {
  readonly strippedFields: ReadonlyArray<string>;
  readonly distPrefixStripped: number;
  readonly sourcePackageJsonHash: string;
  readonly outputPackageJsonHash: string;
  readonly outputSizeBytes: number;
}

export interface PrepareDistReport {
  readonly schemaVersion: 1;
  readonly source: {
    readonly path: string;
    readonly packageJsonHash: string;
  };
  readonly output: {
    readonly distPath: string;
    readonly packageJsonHash: string;
    readonly sizeBytes: number;
  };
  readonly transforms: {
    readonly strippedFields: ReadonlyArray<string>;
    readonly distPrefixStripped: number;
    readonly metadataCopied: ReadonlyArray<string>;
    readonly pluginsApplied: ReadonlyArray<string>;
  };
  readonly versionVerification: VerifyTagReport | null;
  readonly durationMs: number;
}

export interface CapabilitiesFlag {
  readonly name: string;
  readonly type: "boolean" | "string";
}

export interface CapabilitiesJsonSchema {
  readonly flag: string;
  readonly schema: string;
  readonly version: number;
}

export interface CapabilitiesExitCode {
  readonly code: number;
  readonly name: string;
}

export interface CapabilitiesReport {
  readonly schemaVersion: 1;
  readonly name: "prepare-dist";
  readonly version: string;
  readonly features: ReadonlyArray<string>;
  readonly flags: ReadonlyArray<CapabilitiesFlag>;
  readonly jsonSchemas: ReadonlyArray<CapabilitiesJsonSchema>;
  readonly exitCodes: ReadonlyArray<CapabilitiesExitCode>;
}

export interface Logger {
  readonly log: (message: string) => void;
}

export interface RuntimeLogger extends Logger {
  readonly error: (message: string) => void;
}
