/**
 * Parses the HTML code of the post list page.
 *
 * @returns The ID of the thread and the URL of the post.
 */
export const findThreadIdAndPostUrlByPostId = (str: string, postId: number) => {
	// The post id is always regex compliant and therefore do not need to be regex escaped.
	const results = str.match(
		new RegExp(`href="(https?:\\/\\/.+?thread\\/(\\d+)-[A-Za-z0-9%]+\\/?.*?(\\?|&|&quest;|&amp;)postID=${postId}.*?)"`)
	);

	if (results === null) {
		return { threadId: null, postUrl: null };
	}

	return {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		threadId: Number(results[2]!),
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		postUrl: results[1]!.replaceAll('&quest;', '?').replaceAll('&amp;', '&'),
	};
};
