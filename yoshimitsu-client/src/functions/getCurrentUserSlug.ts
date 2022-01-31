import { getCurrentUser } from '@functions';
import { usernameToUserSlug } from '@helpers';

let _currentUserSlugProm: Promise<string> | null = null;

const _getCurrentUserSlugAsProm = async () => {
	const str = document.documentElement.outerHTML;
	const currentUser = await getCurrentUser();

	// The user id is always regex compliant and therefore do not need to be regex escaped.
	const regex = new RegExp(`href="https?:\\/\\/.+?user\\/${currentUser.userId}-([A-Za-z0-9%]+)\\/?.*?"`);
	const result = str.match(regex)?.[1];

	return result ?? usernameToUserSlug(currentUser.username);
};

/**
 * Parses the HTML code of the current page.
 *
 * @returns The slug of current user.
 */
export const getCurrentUserSlug = () => {
	if (_currentUserSlugProm) {
		return _currentUserSlugProm;
	}

	_currentUserSlugProm = _getCurrentUserSlugAsProm();

	return _currentUserSlugProm;
};
