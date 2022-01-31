import { fetchWithRetry } from '@helpers';

/**
 *
 * @returns The current email address of the user.
 */
export const getEmailAddress = async () => {
	const response = await fetchWithRetry(`${window.WCF_PATH}index.php?account-management/`);
	const text = await response.text();

	const parser = new DOMParser();
	const doc = parser.parseFromString(text, 'text/html');

	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	const emailInputElement = doc.getElementById('email') as HTMLInputElement | null;

	if (!emailInputElement) {
		return null;
	}

	return emailInputElement.value;
};
