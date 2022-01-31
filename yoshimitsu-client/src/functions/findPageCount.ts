/**
 * Parses the HTML code of a list page.
 *
 * @returns The number of pages.
 */
export const findPageCount = (str: string) => {
	const result = str.match(/data-pages="(\d+)"/)?.[1];

	return result ? Number(result) : 0;
};
