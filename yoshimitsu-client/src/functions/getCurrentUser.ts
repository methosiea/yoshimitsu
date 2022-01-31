import { isUser } from '@guards';
import type { RequireRequire, User, WCFUser } from '@types';

const _wcfUserAsUser = (x: WCFUser): User => ({ userId: x.userID, username: x.username });

const _getCurrentUserAsProm = async (): Promise<User> => {
	const user = window.WCF ? _wcfUserAsUser(window.WCF.User) : null;

	// Check if the user exists.
	if (isUser(user)) {
		return user;
	}

	return new Promise((resolve) => {
		// Await the user.
		window.require?.(['User'], (user: User | Pick<User, 'init'> | null | undefined) => {
			// Check if the user exists.
			if (isUser(user)) {
				resolve(user);

				return;
			}

			if (!user || !user.init) {
				return;
			}

			// If the user does not exist yet, the `init` function is hooked.
			// `handleUserInitialized` is called after the init function has been called.
			const handleUserInitialized = () => {
				// Check if the user does not exists.
				if (!isUser(user)) {
					return;
				}

				resolve(user);
			};

			// Extract the init function.
			const init = user.init.bind(user);

			// Reassign the init function.
			Object.assign(user, {
				init(...args: unknown[]) {
					// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
					const returnValue = init.apply(this, args) as unknown;

					handleUserInitialized();

					return returnValue;
				},
			});
		});
	});
};

declare global {
	interface Window {
		require?: RequireRequire;
	}
}

let _userProm: Promise<User> | null = null;

/**
 * @returns The current user. If no user is logged in, the user ID is 0 and the user name is empty.
 */
export const getCurrentUser = (): Promise<User> => {
	if (_userProm) {
		return _userProm;
	}

	_userProm = _getCurrentUserAsProm();

	return _userProm;
};
