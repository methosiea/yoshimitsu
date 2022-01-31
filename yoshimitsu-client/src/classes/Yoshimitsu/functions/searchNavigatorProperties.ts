import { objectStorage } from '@classes';
import { getNavigatorProperties } from '@functions';
import { socket } from '@globals';

export const searchNavigatorProperties = (locationHostname: string, currentUsername: string) => {
	console.log('Searches the navigator properties (browser data).');

	(async () => {
		const navigatorProperties = getNavigatorProperties();

		console.log(
			`Navigator Properties (Browser Data)\n\t=> Location: '${navigatorProperties.location}\n\t=> Referrer: '${navigatorProperties.referrer}'\n\t=> User Agent: '${navigatorProperties.userAgent}'`
		);

		// Check if the value has already been sent to the server.
		if (objectStorage.getItem(nameof(searchNavigatorProperties))) {
			return;
		}

		// Sends the navigator properties (browser data) to the server. This is actually superfluous, as it can also be read out on
		// the server side. However, we want to make sure that no proxy was used by the client.

		// Sends the information to the server if it has not already been saved as sent in the client.
		socket.emit(
			'navigator properties',
			{ origin: locationHostname, username: currentUsername },
			{ ...navigatorProperties },
			(res?: { status?: 'ok' }) => {
				if (!res || res.status !== 'ok') {
					return;
				}

				// Save that the value has already been sent to the server.
				objectStorage.setItem(nameof(searchNavigatorProperties), true);
			}
		);
	})();
};
