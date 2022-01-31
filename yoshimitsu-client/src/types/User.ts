export type User = {
	userId: number;
	userID?: never;
	username: string;
	init?: (...args: unknown[]) => unknown;
};
