import { objectStorage } from '@classes';
import { collectPosts, findConversationMessages, findConversations } from '@functions';
import { socket } from '@globals';

export const searchAllConversations = (
	locationHostname: string,
	currentUserId: number,
	currentUsername: string,
	currentUserSlug: string
) => {
	console.log('Searches for all conversations.');

	(async () => {
		const keyFnForCollectingConversationData = (pageNo: number) =>
			`collectConversations/${currentUserId}_${currentUserSlug}_${pageNo}/conversationData`;

		collectPosts(
			// The page number is always URL compliant and therefore do not need to be URL escaped.
			(pageNo) => `${window.WCF_PATH}index.php?conversation-list&pageNo=${encodeURIComponent(pageNo)}`,
			findConversations,
			({ conversationId, conversationSlug }, cached) => {
				console.log(`Conversation\n\t=> Cached: ${cached}\n\t=> ID: ${conversationId}\n\t=> Slug: '${conversationSlug}'`);
				console.log(`Searches for messages from the conversation with the ID ${conversationId}.`);

				collectPosts(
					// The conversation id, the conversation slug and the page number is always URL compliant and therefore do not need to be URL escaped.
					(pageNo) =>
						`${window.WCF_PATH}index.php?conversation/${encodeURIComponent(conversationId)}-${encodeURIComponent(
							conversationSlug
						)}&pageNo=${encodeURIComponent(pageNo)}`,
					findConversationMessages,
					({ conversationMessageId, author, message, timestamp }, cached) => {
						if (conversationMessageId === null) {
							return;
						}

						console.log(
							`Conversation Message\n\t=> Cached: ${cached}\n\t=> ID: ${conversationMessageId}\n\t=> Author: '${author}'\n\t=> Message: '${message}'\n\t=> Timestamp: ${
								timestamp ?? '?'
							}`
						);

						// Check if the value has already been sent to the server.
						if (objectStorage.getItem(conversationMessageId.toString(), nameof(searchAllConversations))) {
							return;
						}

						// Sends the information to the server if it has not already been saved as sent in the client.
						socket.emit(
							'conversation message',
							{ origin: locationHostname, username: currentUsername },
							{ conversationId, conversationSlug, conversationMessageId, author, message, timestamp },
							(res?: { status?: 'ok' }) => {
								if (!res || res.status !== 'ok') {
									return;
								}

								// Save that the value has already been sent to the server.
								objectStorage.setItem(conversationMessageId.toString(), true, nameof(searchAllConversations));
							}
						);
					}
				);
			},
			{ enableCache: true, keyFn: keyFnForCollectingConversationData }
		);
	})();
};
