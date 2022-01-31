import type { ThreadAndPostData } from '@types';

export const isThreadAndPostData = (x: unknown): x is ThreadAndPostData => {
	if (typeof x !== 'object' || x === null) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('threadId' in x) || typeof (x as { threadId: unknown }).threadId !== 'number') {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('postId' in x) || typeof (x as { postId: unknown }).postId !== 'number') {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	if (!('postUrl' in x) || typeof (x as { postUrl: unknown }).postUrl !== 'string') {
		return false;
	}

	return true;
};
