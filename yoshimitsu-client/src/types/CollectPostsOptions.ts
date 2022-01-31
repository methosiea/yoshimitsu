/**
 * Additional options for {@link collectPosts}.
 */
export type CollectPostsOptions<T> = {
	/**
	 * Enables the default caching.
	 */
	enableCache: boolean;

	/**
	 * Maps the page number to the key.
	 *
	 * Is the same as `pageNo.toString()` per default.
	 */
	keyFn: (pageNo: number) => string;

	/**
	 * Get post IDs for the current page. It is optional but recommended for better performance.
	 *
	 * Is the same as `JSON.parse(localStorage.getItem(key))` per default when `enableCache` is set to true.
	 */
	loadPostValuesByPageNo: (key: string) => T[] | null;

	/**
	 * Set post IDs for the current page. It is optional but recommended for better performance.
	 *
	 * Is the same as `localStorage.setItem(JSON.stringify(key))` per default when `enableCache` is set to true.
	 */
	savePostValuesByPageNo: (key: string, postValues: T[]) => void;
};
