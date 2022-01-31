/**
 * Parses the HTML code of the conversation list page.
 *
 * @returns The IDs and slugs of the conversations.
 */
export const findConversations = (str: string) =>
	Array.from(str.matchAll(/href="https?:\/\/.+?conversation\/(\d+)-([A-Za-z0-9%]+)\/?.*?"/g), (x) => ({
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		conversationId: Number(x[1]!),
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		conversationSlug: x[2]!,
	}));
