import type { WCFUser } from '@types';

declare global {
	interface Window {
		WCF?: {
			User: WCFUser;
		};

		WCF_PATH: string;
		/**
		 * It seems that this URL is dependent on whether you are on the main page or not.
		 */
		WSC_API_URL: string;
		SECURITY_TOKEN: string;

		/**
		 * Indicator whether Yoshimitsu has already been initialized or not.
		 */
		yoshimitsuInitialized?: boolean;
		yoshimitsuInstanceId?: number;
	}
}
