export type ConversationAndConversationMessageData = {
	conversationId: number;
	conversationSlug: string;
	conversationMessageId: number;
	author: string;
	message: string;
	timestamp: number | null;
};
