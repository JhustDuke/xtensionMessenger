import { createDefaultPreset } from "ts-jest";
const tsJestTransformCfg = createDefaultPreset().transform;

export const testEnvironment = "node";
export const transform = {
	...tsJestTransformCfg,
};
export const setupFiles = ["jest-webextension-mock"];
export const moduleFileExtensions = ["ts", "js"];
export const testMatch = ["**/test/**/*.test.ts"];
