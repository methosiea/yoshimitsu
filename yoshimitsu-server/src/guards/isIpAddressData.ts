import type { IpAddressData } from '@types';

export const isIpAddressData = (x: unknown): x is IpAddressData => {
	if (typeof x !== 'object' || x === null) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('ipAddress' in x) || typeof (x as { ipAddress: unknown }).ipAddress !== 'string') {
		return false;
	}

	return true;
};
