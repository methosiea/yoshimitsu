import type { SenderInfo } from '@types';

export const isSenderInfo = (x: unknown): x is SenderInfo => {
	if (typeof x !== 'object' || x === null) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('origin' in x) || typeof (x as { origin: unknown }).origin !== 'string') {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('username' in x) || typeof (x as { username: unknown }).username !== 'string') {
		return false;
	}

	return true;
};
