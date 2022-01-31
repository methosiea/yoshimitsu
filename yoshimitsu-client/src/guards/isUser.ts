import type { User } from '@types';

export const isUser = (x: unknown): x is User => {
	if (typeof x !== 'object' || x === null) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('userId' in x) || typeof (x as { userId: unknown }).userId !== 'number' || (x as { userId: number }).userId === 0) {
		return false;
	}

	if (
		!('username' in x) ||
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		typeof (x as { username: unknown }).username !== 'string' ||
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		(x as { username: string }).username.length === 0
	) {
		return false;
	}

	return true;
};
