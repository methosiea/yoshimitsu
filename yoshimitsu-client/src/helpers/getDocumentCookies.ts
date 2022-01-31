import type { Cookies } from '@types';

/**
 * Gets the cookies of the current document.
 */
export const getDocumentCookies = () => {
	const cookieArray = document.cookie.split('; ');
	const cookies: Cookies = {};

	for (let i = cookieArray.length; i--; ) {
		const cookieItem = cookieArray[i];

		if (!cookieItem) {
			continue;
		}

		const [k, v] = cookieItem.split('=');

		if (k === undefined || v === undefined) {
			continue;
		}

		cookies[k] = v;
	}

	return cookies;
};
