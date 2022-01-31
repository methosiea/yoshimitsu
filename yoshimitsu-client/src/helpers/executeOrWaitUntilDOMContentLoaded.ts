export const executeOrWaitUntilDOMContentLoaded = (fn: () => void) => {
	if (document.readyState !== 'loading') {
		fn();

		return;
	}

	const handleReadyStateChange = () => {
		document.removeEventListener('readystatechange', handleReadyStateChange);
		fn();
	};

	document.addEventListener('readystatechange', handleReadyStateChange);
};
