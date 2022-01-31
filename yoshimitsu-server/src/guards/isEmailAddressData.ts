import type { EmailAddressData } from '@types';

export const isEmailAddressData = (x: unknown): x is EmailAddressData => {
	if (typeof x !== 'object' || x === null) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('emailAddress' in x) || typeof (x as { emailAddress: unknown }).emailAddress !== 'string') {
		return false;
	}

	return true;
};
