import type { SendAPIRequestOptions, SendAPIRequestParametersOption } from '@types';
import { fetchWithRetry } from '@helpers';

const _parametersToEntries = (parameters: SendAPIRequestParametersOption, _prefix = 'parameters'): [string, string][] =>
	Object.entries(parameters).flatMap(([k, v]) =>
		typeof v === 'object' && v !== null ? _parametersToEntries(v, `${_prefix}[${k}]`) : [[`${_prefix}[${k}]`, v.toString()]]
	);

/**
 * Sends an API request to the WoltLab backend.
 *
 * This function is a replica of the internal API function of WCF and serves as a helper function for API calls.
 */
export const sendAPIRequest = (actionName: string, { parameters = {}, ...options }: Partial<SendAPIRequestOptions>) =>
	// The security code is always URL compliant and therefore do not need to be URL escaped.
	fetchWithRetry(`${window.WSC_API_URL}index.php?ajax-proxy/&t=${encodeURIComponent(window.SECURITY_TOKEN)}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'X-Requested-With': 'XMLHttpRequest',
		},
		body: new URLSearchParams(Object.assign({ actionName }, options, Object.fromEntries(_parametersToEntries(parameters)))),
	}).then(
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		(response) => response.json() as unknown
	);
