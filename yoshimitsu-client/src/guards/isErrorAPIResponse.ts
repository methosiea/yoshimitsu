import type { ErrorAPIResponse } from '@types';

export const isErrorAPIResponse = (x: unknown): x is ErrorAPIResponse => {
	if (typeof x !== 'object' || x === null) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('code' in x) || typeof (x as { code: unknown }).code !== 'number') {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (isNaN((x as { code: number }).code)) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('message' in x) || typeof (x as { message: unknown }).message !== 'string') {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!(x as { message: string }).message) {
		return false;
	}

	return true;
};
