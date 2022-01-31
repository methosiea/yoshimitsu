export type RequireRequire = {
	(module: string): unknown;
	(modules: string[]): void;
	(modules: string[], ready: (...args: unknown[]) => void): void;
	(modules: string[], ready: (...args: unknown[]) => void, errback: (...args: unknown[]) => void): void;
};
