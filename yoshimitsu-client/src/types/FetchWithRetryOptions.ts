/**
 * Additional options for {@link fetchWithRetry}.
 */
export type FetchWithRetryOptions = {
	retries: number;
	retryDelay: number;
	retryOn: number[];
	noSkipOnNotSuccessful: boolean;
};
