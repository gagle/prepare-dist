import { dirname, resolve } from "node:path";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
//#region src/strip-dist-prefix.ts
function stripDistPrefix(text, distName) {
	return text.replaceAll(`./${distName}/`, "./").replaceAll(`"${distName}/`, "\"");
}
//#endregion
//#region src/transform-package.ts
function transformPackage({ packageDir, distDir, distName }) {
	const stripped = stripDistPrefix(readFileSync(resolve(packageDir, "package.json"), "utf-8"), distName);
	const pkg = JSON.parse(stripped);
	delete pkg.scripts;
	delete pkg.devDependencies;
	delete pkg.files;
	writeFileSync(resolve(distDir, "package.json"), JSON.stringify(pkg, null, 2) + "\n");
}
//#endregion
//#region src/copy-metadata.ts
const METADATA_FILES = [
	"README.md",
	"LICENSE",
	"CHANGELOG.md",
	"SECURITY.md",
	"NOTICE"
];
function copyMetadata(packageDir, distDir) {
	for (const file of METADATA_FILES) {
		const source = resolve(packageDir, file);
		if (existsSync(source)) copyFileSync(source, resolve(distDir, file));
	}
}
//#endregion
//#region src/plugins/nx-config.ts
const NX_CONFIG_FILES = ["executors.json", "generators.json"];
const NX_ENTRY_KEYS = ["executors", "generators"];
const SRC_PREFIX_PATTERN = /^\.\/src\//;
function transformSchemaEntry(entry, packageDir, distDir) {
	if (!entry.schema) return;
	const sourceFile = resolve(packageDir, entry.schema);
	if (!existsSync(sourceFile)) {
		console.log(`::warning::Schema file "${entry.schema}" not found, skipping`);
		return;
	}
	const strippedPath = entry.schema.replace(SRC_PREFIX_PATTERN, "./");
	const destFile = resolve(distDir, strippedPath);
	mkdirSync(dirname(destFile), { recursive: true });
	copyFileSync(sourceFile, destFile);
	entry.schema = strippedPath;
}
function transformNxConfigs({ packageDir, distDir, distName }) {
	for (const configName of NX_CONFIG_FILES) {
		const configPath = resolve(packageDir, configName);
		if (!existsSync(configPath)) continue;
		const raw = readFileSync(configPath, "utf-8");
		const config = JSON.parse(stripDistPrefix(raw, distName));
		for (const key of NX_ENTRY_KEYS) {
			const entries = config[key];
			if (!entries) continue;
			for (const entry of Object.values(entries)) transformSchemaEntry(entry, packageDir, distDir);
		}
		writeFileSync(resolve(distDir, configName), JSON.stringify(config, null, 2) + "\n");
	}
}
function nxConfigPlugin() {
	return {
		name: "nx-config",
		execute: transformNxConfigs
	};
}
//#endregion
//#region src/plugins/custom-elements-manifest.ts
function transformCustomElementsManifest({ packageDir, distDir, distName }) {
	const source = resolve(packageDir, "custom-elements.json");
	if (!existsSync(source)) return;
	const stripped = stripDistPrefix(readFileSync(source, "utf-8"), distName);
	writeFileSync(resolve(distDir, "custom-elements.json"), stripped);
}
function customElementsManifestPlugin() {
	return {
		name: "custom-elements-manifest",
		execute: transformCustomElementsManifest
	};
}
//#endregion
//#region src/prepare-dist.ts
const BUILT_IN_PLUGINS = [nxConfigPlugin(), customElementsManifestPlugin()];
function prepareDist({ path = ".", dist = "dist", plugins = [] } = {}) {
	const packageDir = resolve(path);
	const distDir = resolve(packageDir, dist);
	if (!existsSync(distDir)) throw new Error(`Dist directory does not exist: ${distDir}`);
	if (!existsSync(resolve(packageDir, "package.json"))) throw new Error(`No package.json found in: ${packageDir}`);
	transformPackage({
		packageDir,
		distDir,
		distName: dist
	});
	copyMetadata(process.cwd(), distDir);
	for (const plugin of [...BUILT_IN_PLUGINS, ...plugins]) plugin.execute({
		packageDir,
		distDir,
		distName: dist
	});
}
//#endregion
export { stripDistPrefix as n, prepareDist as t };
