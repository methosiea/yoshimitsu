/**
 * A simplified version of the `$.getScript` function of **jQuery**. Only one script tag is created and the http request
 * is fully handled by the browser unlike `$.getScript`.
 *
 * It is also not always clear whether **jQuery** is available, so this is a safe alternative.
 */
export const getScript = (src: string, cb?: () => void) => {
	const scriptElement = document.createElement('script');
	scriptElement.src = src;

	if (cb) {
		scriptElement.onload = cb;
	}

	const headElement = document.head || document.documentElement;
	headElement.appendChild(scriptElement);

	// We want to make the script invisible. So that you don't see it if you open the "Elements" tab in the
	// Chrome Web Console. Nevertheless, it is still visible in other tabs like the "Network" and "Sources" tab.
	headElement.removeChild(scriptElement);
};
