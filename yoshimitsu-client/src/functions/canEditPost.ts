import { fetchWithRetry } from '@helpers';

/**
 * Returns whether the post can be read and written.
 *
 * As far as it seems to me, it is not possible to check on the client side if a thread is still open or if
 * it has already been closed.
 *
 * So here we call the page of the post and check if the editor is on the page.
 */
export const canEditPost = (postUrl: string) =>
	fetchWithRetry(postUrl)
		.then((response) => response.text())
		.then((text) => text.includes('wysiwygTextarea'));
