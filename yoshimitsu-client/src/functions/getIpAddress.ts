import { fetchWithRetry } from '@helpers';

const _CLOUDFLARE_GET_IP_URL = 'https://www.cloudflare.com/cdn-cgi/trace';

/**
 *
 * @returns The current ip address of the user.
 */
export const getIpAddress = () =>
	// Since this is not directly realizable with JavaScript in the browser, we call an endpoint
	// from Cloudflare. This should always be available.
	fetchWithRetry(_CLOUDFLARE_GET_IP_URL)
		.then((response) => response.text())
		.then(
			(data) =>
				data
					.split('\n')
					.find((prop) => prop.startsWith('ip'))
					?.split('=', 2)[1] ?? null
		);
