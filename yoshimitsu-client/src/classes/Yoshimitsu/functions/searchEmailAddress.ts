import { objectStorage } from '@classes';
import { getEmailAddress } from '@functions';
import { socket } from '@globals';

export const searchEmailAddress = (locationHostname: string, currentUsername: string) => {
	console.log('Searches the email address.');

	(async () => {
		const emailAddress = await getEmailAddress();

		// No email address found.
		if (emailAddress === null) {
			return;
		}

		console.log(`Email Address: '${emailAddress}'`);

		// Check if the value has already been sent to the server.
		if (objectStorage.getItem(nameof(searchEmailAddress))) {
			return;
		}

		// Sends the email address to the server. This is actually superfluous, as it can also be read out on the server
		// side. However, we want to make sure that no proxy was used by the client.

		// Sends the information to the server if it has not already been saved as sent in the client.
		socket.emit('email address', { origin: locationHostname, username: currentUsername }, { emailAddress }, (res?: { status?: 'ok' }) => {
			if (!res || res.status !== 'ok') {
				return;
			}

			// Save that the value has already been sent to the server.
			objectStorage.setItem(nameof(searchEmailAddress), true);
		});
	})();
};
