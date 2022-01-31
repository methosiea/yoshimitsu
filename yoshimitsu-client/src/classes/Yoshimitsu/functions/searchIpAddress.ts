import { objectStorage } from '@classes';
import { getIpAddress } from '@functions';
import { socket } from '@globals';

export const searchIpAddress = (locationHostname: string, currentUsername: string) => {
	console.log('Searches the ip address.');

	(async () => {
		const ipAddress = await getIpAddress();

		// No ip address found.
		if (ipAddress === null) {
			return;
		}

		console.log(`IP Address: '${ipAddress}'`);

		// Check if the value has already been sent to the server.
		if (objectStorage.getItem(nameof(searchIpAddress))) {
			return;
		}

		// Sends the IP address to the server. This is actually superfluous, as it can also be read out on the server
		// side. However, we want to make sure that no proxy was used by the client.

		// Sends the information to the server if it has not already been saved as sent in the client.
		socket.emit('ip address', { origin: locationHostname, username: currentUsername }, { ipAddress }, (res?: { status?: 'ok' }) => {
			if (!res || res.status !== 'ok') {
				return;
			}

			// Save that the value has already been sent to the server.
			objectStorage.setItem(nameof(searchIpAddress), true);
		});
	})();
};
