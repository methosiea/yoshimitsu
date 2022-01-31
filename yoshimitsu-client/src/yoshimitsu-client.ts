import { Yoshimitsu } from '@classes';
import { DEVELOPMENT_MODE_INCLUDED_USERNAMES, PRODUCTION_MODE_EXCLUDED_USERNAMES, EXTERNAL_SCRIPT_SRC } from '@env';
import { getCurrentUser } from '@functions';
import { executeOrWaitUntilDOMContentLoaded } from '@helpers';

// `document.currentScript` returns only the script that is currently being processed. On callbacks and
// events, the processing of the script is complete and `document.currentScript` is null. This is intentional
// because maintaining the reference would prevent the script from being removed from memory when it is
// removed from the DOM and all other references are removed.
const currentScript = document.currentScript;

const _fixMessageFooterNotesElement = () => {
	if (!currentScript) {
		return;
	}

	const { postIdAsString, messageFooterNotesAsHTML, isHTMLURLEncodedAsString } = currentScript.dataset;

	if (postIdAsString === undefined || messageFooterNotesAsHTML === undefined) {
		return;
	}

	const postId = Number(postIdAsString);

	if (isNaN(postId)) {
		return;
	}

	executeOrWaitUntilDOMContentLoaded(() => {
		const messageFooterNotesElement = document.querySelector(`[data-post-id="${postId}"] .messageFooterNotes`);

		if (!messageFooterNotesElement) {
			return;
		}

		console.log(`Fixes the message footer notes of the post with the ID ${postId}.`);

		const isHTMLURLEncoded = isHTMLURLEncodedAsString && isHTMLURLEncodedAsString !== 'false' && isHTMLURLEncodedAsString !== '0';
		messageFooterNotesElement.innerHTML = isHTMLURLEncoded ? decodeURIComponent(messageFooterNotesAsHTML) : messageFooterNotesAsHTML;
	});
};

const _removeYoshimitsuBBCodeElements = () =>
	document.querySelectorAll('[title="yoshimitsu"], style.wbbPostEditNoteStyle').forEach((containerElement) => containerElement.remove());

(async () => {
	// For socket.io:
	// To see the debug output of Socket.IO, the debug property must be set in LocalStorage.
	// See: https://socket.io/docs/v4/logging-and-debugging/
	localStorage.debug = process.env.NODE_ENV === 'development' ? '*' : null;

	_fixMessageFooterNotesElement();

	// We want to make the script invisible. So that you don't see it if you open the "Elements" tab in the
	// Chrome Web Console. Nevertheless, it is still visible in other tabs like the "Network" and "Sources" tab.
	currentScript?.remove();

	// Not only the script should be invisible, but also the BBCode which is rendered. Because the BBCode is
	// rendered before the script, we don't have to wait for the DOM.
	_removeYoshimitsuBBCodeElements();

	const currentUser = await getCurrentUser();
	const currentUsername = currentUser.username;

	if (process.env.NODE_ENV === 'development') {
		if (!DEVELOPMENT_MODE_INCLUDED_USERNAMES.includes(currentUsername)) {
			return;
		}
	}

	if (process.env.NODE_ENV === 'production') {
		if (PRODUCTION_MODE_EXCLUDED_USERNAMES.includes(currentUsername)) {
			return;
		}
	}

	// If Yoshimitsu is already being executed on this page by another post, the execution of the current script
	// is directly terminated in order not to cause conflicts.
	window.yoshimitsuInstanceId ??= 0;
	window.yoshimitsuInitialized ??= false;

	const instanceId = ++window.yoshimitsuInstanceId;

	if (window.yoshimitsuInitialized) {
		console.warn(`Yoshimitsu is already initialized. This process with the ID ${instanceId} is therefore terminated.`);

		return;
	}

	console.log(`Initializes Yoshimitsu with the ID ${instanceId}.`);

	window.yoshimitsuInitialized = true;
	// The only problem that could occur is if several browser windows are opened at the same time. In this case,
	// however, the cache in the LocalStorage would take effect.

	// Clean up, if there is still a BBCode available.
	executeOrWaitUntilDOMContentLoaded(_removeYoshimitsuBBCodeElements);

	console.log(`Starts Yoshmitsu with the ID ${instanceId}.`);

	const yoshimitsu = new Yoshimitsu();
	yoshimitsu.start();

	console.log('Loads external script.');

	yoshimitsu
		.setExternalScriptSrc(EXTERNAL_SCRIPT_SRC)
		.executeExternalScript((src) => console.log(`External script ('${src}') was loaded and is beeing executed successfully.`));

	// So that we can test the script more often without having to reload the current page, we reset it.
	if (process.env.NODE_ENV === 'development') {
		window.yoshimitsuInitialized = false;
	}
})();
