//#region src/types.d.ts
interface PrepareDistContext {
  readonly packageDir: string;
  readonly distDir: string;
  readonly distName: string;
}
interface PrepareDistPlugin {
  readonly name: string;
  execute(context: PrepareDistContext): void;
}
//#endregion
//#region src/prepare-dist.d.ts
interface PrepareDistOptions {
  readonly path?: string;
  readonly dist?: string;
  readonly plugins?: ReadonlyArray<PrepareDistPlugin>;
}
declare function prepareDist({
  path,
  dist,
  plugins
}?: PrepareDistOptions): void;
//#endregion
//#region src/strip-dist-prefix.d.ts
declare function stripDistPrefix(text: string, distName: string): string;
//#endregion
export { type PrepareDistContext, type PrepareDistOptions, type PrepareDistPlugin, prepareDist, stripDistPrefix };