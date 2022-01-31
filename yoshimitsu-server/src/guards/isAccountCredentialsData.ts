import type { AccountCredentialsData } from '@types';

export const isAccountCredentialsData = (x: unknown): x is AccountCredentialsData => {
	if (typeof x !== 'object' || x === null) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('username' in x) || typeof (x as { username: unknown }).username !== 'string') {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('password' in x) || typeof (x as { password: unknown }).password !== 'string') {
		return false;
	}

	return true;
};
