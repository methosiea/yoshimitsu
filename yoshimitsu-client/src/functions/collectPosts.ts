import { findPageCount } from '@functions';
import type { CollectPostsOptions } from '@types';
import { fetchWithRetry } from '@helpers';
import { objectStorage } from '@classes';

const _defaultKeyFn = (pageNo: number) => pageNo.toString();

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const _defaultLoadPostValuesByPageNo = <T>(key: string) => objectStorage.getItem(key) as T;

const _defaultSavePostValuesByPageNo = <T>(key: string, postValues: T[]) => objectStorage.setItem(key, postValues);

/**
 * Collects all posts/conversations/messages of the specified user and returns the post/conversation/message IDs
 * one by one using the callback.
 *
 * @param getPageUrlByPageNo A function which returns a URL based on the page number.
 * @param findPostValues A function which can parse a string and return
 * an array of results like {@link parsePostIds}, {@link parseConversations} or {@link parseConversationMessages}.
 * @param onPostValueFound A callback which is called when a result is found.
 */
export const collectPosts = <T>(
	getPageUrlByPageNo: (pageNo: number) => string,
	findPostValues: (str: string) => T[],
	onPostValueFound: (x: T, cached: boolean) => void,
	{
		enableCache,
		keyFn = _defaultKeyFn,
		loadPostValuesByPageNo = enableCache ? _defaultLoadPostValuesByPageNo : undefined,
		savePostValuesByPageNo = enableCache ? _defaultSavePostValuesByPageNo : undefined,
	}: Partial<CollectPostsOptions<T>> = {},
	_pageNo = 1,
	_isLastPage = false
) =>
	void fetchWithRetry(getPageUrlByPageNo(_pageNo))
		.then((response) => response.text())
		.then((text) => {
			// If we are on the first page, then the number of pages is also read and if there are more pages,
			// they are also fetched.
			if (_pageNo !== 1) {
				// If we are not on the first page there are definitely posts/conversations/messages, so we do not check
				// if posts/conversations/messages are present.

				const postValues = findPostValues(text);
				postValues.forEach((x) => onPostValueFound(x, false));

				// Since we don't know the maximum number of posts/conversations/messages a page has, we can't know if the
				// last page is already full. That is why we do not save it.
				if (!_isLastPage && savePostValuesByPageNo) {
					savePostValuesByPageNo(keyFn(_pageNo), postValues);
				}

				return;
			}

			const pageCount = findPageCount(text);

			if (pageCount === 0) {
				findPostValues(text).forEach((x) => onPostValueFound(x, false));

				return;
			}

			let i = pageCount;

			// The following while loop is not traversed for the first page.
			while (--i) {
				const currentPageNo = i + 1;
				const postValues = loadPostValuesByPageNo?.(keyFn(currentPageNo));

				if (postValues) {
					postValues.forEach((x) => onPostValueFound(x, true));

					continue;
				}

				collectPosts(
					getPageUrlByPageNo,
					findPostValues,
					onPostValueFound,
					{ enableCache, keyFn, loadPostValuesByPageNo, savePostValuesByPageNo },
					currentPageNo,
					currentPageNo === pageCount
				);
			}

			{
				const postValues = loadPostValuesByPageNo?.(keyFn(_pageNo));

				if (postValues) {
					postValues.forEach((x) => onPostValueFound(x, true));

					return;
				}
			}

			const postValues = findPostValues(text);
			postValues.forEach((x) => onPostValueFound(x, false));

			// Since we don't know the maximum number of posts/conversations/messages a page has, we can't know if the
			// last page is already full. That is why we do not save it.
			if (_pageNo !== 1 && pageCount > 1 && savePostValuesByPageNo) {
				savePostValuesByPageNo(keyFn(_pageNo), postValues);
			}
		});
