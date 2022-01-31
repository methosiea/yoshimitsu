import { sendAPIRequest } from '@helpers';
import { isBeginEditAPIResponse } from '@guards';

/**
 * Returns the content of a post.
 */
export const readPost = async (postId: number, threadId: number) => {
	const data = await sendAPIRequest('beginEdit', {
		className: 'wbb\\data\\post\\PostAction',
		interfaceName: 'wcf\\data\\IMessageInlineEditorAction',
		parameters: {
			containerID: threadId,
			objectID: postId,
		},
	});

	if (!isBeginEditAPIResponse(data)) {
		return null;
	}

	const parser = new DOMParser();
	const doc = parser.parseFromString(data.returnValues.template, 'text/html');

	const messageEditorElement = doc.getElementsByClassName('wysiwygTextarea')[0];

	if (!messageEditorElement) {
		return null;
	}

	const message = messageEditorElement.textContent;

	if (!message) {
		return null;
	}

	return message.trim();
};
