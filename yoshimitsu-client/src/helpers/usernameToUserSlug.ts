const _NON_ALPHANUMERIC_CHAR_REGEX = /[^A-Za-z0-9]/;

const _nonAlphanumericCharReplacer = (char: string[0]) => {
	const charCode = char.charCodeAt(0);

	// We replace all ASCII characters which are not alphanumeric.
	if (char.length === 1 && charCode >= 0 && charCode <= 127 && _NON_ALPHANUMERIC_CHAR_REGEX.test(char)) {
		return '-';
	}

	return char;
};

/**
 * Converts a username to user slug.
 *
 * @returns A lower-cased, ASCII characters reduced to alphanumeric characters version of a username.
 */
export const usernameToUserSlug = (username: string) =>
	username.replace(/./g, _nonAlphanumericCharReplacer).replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
