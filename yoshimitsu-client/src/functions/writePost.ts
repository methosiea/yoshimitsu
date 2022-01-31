import { noop, sendAPIRequest } from '@helpers';

/**
 * Replaces the content of a post.
 */
export const writePost = (postId: number, threadId: number, message: string) =>
	sendAPIRequest('save', {
		className: 'wbb\\data\\post\\PostAction',
		interfaceName: 'wcf\\data\\IMessageInlineEditorAction',
		parameters: {
			containerID: threadId,
			objectID: postId,
			editReason: '',
			tmpHash: '',
			data: { message },
			poll: {
				pollQuestion: '',
				pollEndTime: '',
				pollMaxVotes: 1,
			},
		},
	}).then(noop);
