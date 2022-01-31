import { executeOrWaitUntilDOMContentLoaded } from '@helpers';

const _getDomainPathAsProm = () =>
	new Promise<string>((resolve) =>
		executeOrWaitUntilDOMContentLoaded(() => {
			// There seems to be no easy way to read out the installation path or domain/cookie path on the client
			// side.

			// Therefore, we examine a script that is loaded with every WoltLab Suite version.
			const wbbScriptElement = document.querySelector<HTMLScriptElement>(
				'[src*="/js/WBB.js"], script[src*="/js/WBB.min.js"], script[src*="/js/WBB.tiny.min.js"]'
			);

			if (!wbbScriptElement) {
				// Most installations are made in the root directory, so we specify this as an alternative.
				resolve(location.origin + '/');

				return;
			}

			const { src } = wbbScriptElement;

			resolve(src.slice(0, src.indexOf('js/WBB.')));
		})
	);

let _domainPath: Promise<string> | null = null;

export const getDomainPath = () => {
	if (_domainPath) {
		return _domainPath;
	}

	_domainPath = _getDomainPathAsProm();

	return _domainPath;
};
