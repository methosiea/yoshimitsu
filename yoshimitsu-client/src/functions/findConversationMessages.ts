import type { ConversationMessage } from '@types';

/**
 * Parses the HTML code of a conversation page.
 *
 * @returns The authors, the messages and the timestamps.
 */
export const findConversationMessages = (str: string) => {
	const messages: ConversationMessage[] = [];

	const parser = new DOMParser();
	const doc = parser.parseFromString(str, 'text/html');

	Array.prototype.forEach.call(doc.getElementsByClassName('message'), (messageElement: HTMLElement) => {
		// First we look for the element where the name of the author is located.
		const messageSidebarUsernameElement = messageElement.querySelector<HTMLElement>('.messageSidebarUsername');

		if (!messageSidebarUsernameElement) {
			return;
		}

		const author = messageSidebarUsernameElement.innerText.trim();

		if (!author) {
			return;
		}

		// Then we look for the element where the message of the author is located.
		const messageTextElement = messageElement.querySelector<HTMLElement>('.messageText');

		if (!messageTextElement) {
			return;
		}

		const message = messageTextElement.innerText.trim().replace(/\s+/g, ' ');

		if (!message) {
			return;
		}

		const dateTimeElement = messageElement.querySelector<HTMLElement>('.datetime');

		// The timestamp is optional. Should it really be the case that this is not available,
		// the message should still be processed.
		let timestamp: number | null = null;

		if (dateTimeElement && dateTimeElement.dataset.timestamp) {
			timestamp = Number(dateTimeElement.dataset.timestamp) || null;
		}

		// Here we have to determine the ID of the message so that it can then be cached.
		let conversationMessageId: number | null = null;

		if (messageElement.dataset.objectId) {
			conversationMessageId = Number(messageElement.dataset.objectId) || null;
		}

		messages.push({
			conversationMessageId,
			author,
			message,
			timestamp,
		});
	});

	return messages;
};
