import { t as prepareDist } from "./prepare-dist.mjs";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
//#region src/verify-tag.ts
function verifyTag({ distDir, tag }) {
	const version = tag.replace(/^.*v(?=\d)/, "");
	if (!/^\d+\.\d+\.\d+/.test(version)) throw new Error(`Could not extract a valid version from tag "${tag}"`);
	const pkg = JSON.parse(readFileSync(resolve(distDir, "package.json"), "utf-8"));
	if (pkg.version !== version) throw new Error(`Tag version "${version}" (from "${tag}") does not match package.json version "${pkg.version}"`);
}
//#endregion
//#region src/main.ts
const path = process.env.INPUT_PATH ?? ".";
const dist = process.env.INPUT_DIST ?? "dist";
const tag = process.env.INPUT_TAG ?? "";
try {
	prepareDist({
		path,
		dist
	});
	if (tag) verifyTag({
		distDir: resolve(path, dist),
		tag
	});
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.log(`::error::${message}`);
	process.exitCode = 1;
}
//#endregion
export {};
