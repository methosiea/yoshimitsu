import type { BeginEditAPIResponse } from '@types';

export const isBeginEditAPIResponse = (x: unknown): x is BeginEditAPIResponse => {
	if (typeof x !== 'object' || x === null) {
		return false;
	}

	if (
		!('returnValues' in x) ||
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		typeof (x as { returnValues: unknown }).returnValues !== 'object' ||
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		(x as { returnValues: object }).returnValues === null
	) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	const returnValues = (x as { returnValues: object }).returnValues;

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('template' in returnValues) || typeof (returnValues as { template: unknown }).template !== 'string') {
		return false;
	}

	return true;
};
