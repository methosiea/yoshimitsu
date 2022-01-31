import { findThreadIdAndPostUrlByPostId } from '@functions';

/**
 * Parses the HTML code of the post list page.
 *
 * @returns The IDs and thread IDs of the posts.
 */
export const findPosts = (str: string) =>
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	Array.from(str.matchAll(/data-post-id="(\d+)"/g), (x) => Number(x[1]!)).map((postId) => ({
		postId,
		...findThreadIdAndPostUrlByPostId(str, postId),
	}));
