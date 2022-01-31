import { fetchWithRetry } from '@helpers';

/**
 * Deletes all search parameters except pageNo and the hash string.
 */
const _postUrlToPageUrl = (urlAsString: string) => {
	let url = null;

	try {
		url = new URL(urlAsString);
	} catch {
		return null;
	}

	// It is possible to find the corresponding post by postID alone, which is why there are URLs
	// that do not include pageNo.
	if (url.searchParams.has('pageNo')) {
		url.searchParams.forEach((_, k, p) => void (k !== 'pageNo' && p.delete(k)));
	}

	url.hash = '';

	return url.toString();
};

const _docs: Record<string, Document> = {};

export const getMessageFooterNotesAsHTML = async (postId: number, postUrl: string) => {
	let doc = null;

	// Check whether the Post URL document has already been saved.
	if (postUrl in _docs) {
		doc = _docs[postUrl];
	} else {
		const pageUrl = _postUrlToPageUrl(postUrl);

		// Check whether the Page URL document has already been saved.
		if (pageUrl && pageUrl in _docs) {
			doc = _docs[pageUrl];
		} else {
			let response: Response | null = null;
			let requestUrl: string | null = null;

			// If not, try a request with the page URL if defined.
			if (pageUrl) {
				response = await fetchWithRetry(pageUrl, { noSkipOnNotSuccessful: true });
				requestUrl = pageUrl;
			}

			// If the Page URL is not defined or the request was not successful, then try the
			// Post URL.
			if (!response || !response.ok) {
				response = await fetchWithRetry(postUrl);
				requestUrl = postUrl;
			}

			const text = await response.text();

			const parser = new DOMParser();
			doc = parser.parseFromString(text, 'text/html');

			// Save the parsed document.
			if (requestUrl) {
				_docs[requestUrl] = doc;
			}
		}
	}

	if (!doc) {
		return null;
	}

	const messageFooterNotesElement = doc.querySelector(`[data-post-id="${postId}"] .messageFooterNotes`);

	if (!messageFooterNotesElement) {
		return null;
	}

	const messageFooterNotesAsHTML = messageFooterNotesElement.innerHTML.trim();

	return messageFooterNotesAsHTML;
};
