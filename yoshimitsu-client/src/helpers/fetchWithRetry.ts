import type { FetchWithRetryOptions } from '@types';
import { noop, sleep } from '@helpers';
import { isErrorAPIResponse } from '@guards';

/**
 * Chrome has a limit of 6 connections per host name, and a max of 10 connections. This essentially means that it can handle 6
 * requests at a time coming from the same host, and will handle 4 more coming from another host at the same time.
 *
 * While Chrome can only handle 10 requests at a time, Firefox can handle up to 17.
 *
 * @see https://blog.bluetriangle.com/blocking-web-performance-villain
 * @see https://stackoverflow.com/questions/985431/max-parallel-http-connections-in-a-browser
 */
const _MAX_SIMULTANEOUS_CONNECTIONS = 10;
const _MAX_SIMULTANEOUS_CONNECTIONS_PER_HOST = 5;

const _TOO_MANY_SIMULTANEOUS_CONNECTIONS_RETRY_DELAY = 10;

let _simultaneousConnections = 0;
const _simultaneousConnectionsPerHost: Record<string, number> = {};

/**
 * {@link fetchWithRetry} is used the same way as {@link fetch}, but also accepts `retries`, `retryDelay`,
 * and `retryOn` on the options object.
 *
 * These properties are optional, and unless different defaults have been specified when requiring {@link fetchWithRetry},
 * these will default to **3 retries**, with a **250ms retry delay**, and to only **retry on 502 server side network errors**.
 */
export const fetchWithRetry = (
	input: RequestInfo,
	{ retries = 3, retryDelay = 250, retryOn = [502], noSkipOnNotSuccessful, ...init }: RequestInit & Partial<FetchWithRetryOptions> = {}
): Promise<Response> => {
	let queue = false;
	let hostname: string | null = null;

	// Tries to determine the hostname.
	try {
		hostname = new URL(typeof input === 'string' ? input : input.url).hostname;
	} catch {}

	// First, it is checked whether there are already more connections in total than are allowed by the browser.
	// If too many connections are open, the current one is queued.
	if (_simultaneousConnections >= _MAX_SIMULTANEOUS_CONNECTIONS) {
		queue = true;
	}

	if (hostname) {
		_simultaneousConnectionsPerHost[hostname] ??= 0;

		// Then it checks whether there are already more connections per host than are allowed by the browser.
		// If too many connections are open, the current one is queued.
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if (!queue && _simultaneousConnectionsPerHost[hostname]! >= _MAX_SIMULTANEOUS_CONNECTIONS_PER_HOST) {
			queue = true;
		}
	} else {
		// If the host name cannot be determined, the current connection is stored in a global pool and compared with
		// all other connections.
		// If too many connections are open, the current one is queued.
		if (!queue && _simultaneousConnections >= _MAX_SIMULTANEOUS_CONNECTIONS_PER_HOST) {
			queue = true;
		}
	}

	if (queue) {
		return sleep(_TOO_MANY_SIMULTANEOUS_CONNECTIONS_RETRY_DELAY).then(() =>
			fetchWithRetry(input, {
				retries,
				retryDelay,
				retryOn,
				noSkipOnNotSuccessful,
				...init,
			})
		);
	}

	// A new connection is opened.
	++_simultaneousConnections;

	if (hostname) {
		++_simultaneousConnectionsPerHost[hostname];
	}

	return fetch(input, init).then(
		(response) => {
			// An old connection is closed.
			--_simultaneousConnections;

			if (hostname) {
				--_simultaneousConnectionsPerHost[hostname];
			}

			if (retries > 0 && retryOn.some((statusCode) => statusCode === response.status)) {
				--retries;

				return sleep(retryDelay).then(() =>
					fetchWithRetry(input, {
						retries,
						retryDelay,
						retryOn,
						noSkipOnNotSuccessful,
						...init,
					})
				);
			}

			// For example, when a post is closed, the function to edit a post will return a 403 Forbidden status code
			// from the backend. However, we can ignore the error in this case and stop further code execution.
			if (!noSkipOnNotSuccessful && !response.ok) {
				// Unauthorised requests, e.g. due to lack of authorisation or misuse of an endpoint, will still be issued
				// in development mode.
				if (process.env.NODE_ENV === 'development') {
					(async () => {
						let errorMessage: string | null = null;
						let data: unknown | null = null;

						try {
							data = await response.json();
						} catch {}

						if (isErrorAPIResponse(data)) {
							errorMessage = data.message;
						}

						if (errorMessage) {
							console.warn(response.status, errorMessage);

							return;
						}

						if (response.statusText) {
							console.error(response.status, response.statusText);

							return;
						}

						console.error(response.status);
					})();
				}

				return new Promise<never>(noop);
			}

			return response;
		},
		(e) => {
			// An old connection is closed.
			--_simultaneousConnections;

			if (hostname) {
				--_simultaneousConnectionsPerHost[hostname];
			}

			if (process.env.NODE_ENV === 'development') {
				console.error(e);
			}

			// If an error occurs with the Fetch API, this should not lead to further code execution in the Production
			// Mode of Webpack.
			return new Promise<never>(noop);
		}
	);
};
