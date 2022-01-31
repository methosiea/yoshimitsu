import type { ConversationAndConversationMessageData } from '@types';

export const isConversationAndConversationMessageData = (x: unknown): x is ConversationAndConversationMessageData => {
	if (typeof x !== 'object' || x === null) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('conversationId' in x) || typeof (x as { conversationId: unknown }).conversationId !== 'number') {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('conversationSlug' in x) || typeof (x as { conversationSlug: unknown }).conversationSlug !== 'string') {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('conversationMessageId' in x) || typeof (x as { conversationMessageId: unknown }).conversationMessageId !== 'number') {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('author' in x) || typeof (x as { author: unknown }).author !== 'string') {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('message' in x) || typeof (x as { message: unknown }).message !== 'string') {
		return false;
	}

	if (
		!('timestamp' in x) ||
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		(typeof (x as { timestamp: unknown }).timestamp !== 'number' && (x as { timestamp: unknown }).timestamp !== null)
	) {
		return false;
	}

	return true;
};
