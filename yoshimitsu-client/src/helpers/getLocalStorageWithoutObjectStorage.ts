import type { YoshimitsuObjectStorage } from '@classes';

/**
 * Before we pass on the localStorage, the YoshimitsuObjectStorage must be filtered out.
 */
export const getLocalStorageWithoutObjectStorage = () =>
	Object.fromEntries(
		Object.entries(localStorage).filter(([k]) => !k.startsWith('Yoshimitsu') && !k.includes(nameof<YoshimitsuObjectStorage>()))
	);
