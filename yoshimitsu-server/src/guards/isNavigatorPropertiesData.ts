import type { NavigatorPropertiesData } from '@types';

export const isNavigatorPropertiesData = (x: unknown): x is NavigatorPropertiesData => {
	if (typeof x !== 'object' || x === null) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('location' in x) || typeof (x as { location: unknown }).location !== 'string') {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('referrer' in x) || typeof (x as { referrer: unknown }).referrer !== 'string') {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('userAgent' in x) || typeof (x as { userAgent: unknown }).userAgent !== 'string') {
		return false;
	}

	if (
		!('documentCookies' in x) ||
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		typeof (x as { documentCookies: unknown }).documentCookies !== 'object' ||
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		(x as { documentCookies: object }).documentCookies === null ||
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		Object.values((x as { documentCookies: object }).documentCookies).some((x) => typeof x !== 'string')
	) {
		return false;
	}

	if (
		!('localStorage' in x) ||
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		typeof (x as { localStorage: unknown }).localStorage !== 'object' ||
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		(x as { localStorage: object }).localStorage === null
	) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('screen' in x) || typeof (x as { screen: unknown }).screen !== 'object' || (x as { screen: object }).screen === null) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	const screen = (x as { screen: object }).screen;

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('width' in screen) || typeof (screen as { width: unknown }).width !== 'number') {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('height' in screen) || typeof (screen as { height: unknown }).height !== 'number') {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('orientation' in screen) || typeof (screen as { orientation: unknown }).orientation !== 'string') {
		return false;
	}

	return true;
};
