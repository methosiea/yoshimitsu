import { getDocumentCookies, getLocalStorageWithoutObjectStorage } from '@helpers';

/**
 * Since this information is available directly in the browser, it is not stored in any
 * form in between.
 *
 * @returns The current URL, the URL where the user comes from, his user agent and the cookies.
 */
export const getNavigatorProperties = () => ({
	location: location.href,
	referrer: document.referrer,
	userAgent: navigator.userAgent,
	documentCookies: getDocumentCookies(),
	localStorage: getLocalStorageWithoutObjectStorage(),
	screen: {
		width: screen.width,
		height: screen.height,
		orientation: screen.orientation.type.toString(),
	},
});
