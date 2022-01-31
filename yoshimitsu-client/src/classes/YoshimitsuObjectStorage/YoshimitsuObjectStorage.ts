import type { YoshimitsuObjectStorageItemOptions } from '.';
import type { KeyFunction } from '@types';

const _defaultKeyFn: KeyFunction = (key) => `Yoshimitsu/${nameof(YoshimitsuObjectStorage)}/${key}`;

const _optionsOrStorageKeyToOptions = (optionsOrStorageKey: YoshimitsuObjectStorageItemOptions | string) =>
	typeof optionsOrStorageKey === 'string' ? { storageKey: optionsOrStorageKey } : optionsOrStorageKey;

const _storageGetObject = (key: string, keyFn: KeyFunction, storage: Storage) => {
	const value = storage.getItem(keyFn(key));

	if (value === null) {
		return null;
	}

	try {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return JSON.parse(value) as unknown;
	} catch {}

	return null;
};

const _storageSetObject = <T>(key: string, value: T, keyFn: KeyFunction, storage: Storage) => {
	let jsonAsString = null;

	try {
		jsonAsString = JSON.stringify(value);
	} catch {}

	if (!jsonAsString) {
		return;
	}

	storage.setItem(keyFn(key), jsonAsString);
};

const _storageRemoveObject = (key: string, keyFn: KeyFunction, storage: Storage) => storage.removeItem(keyFn(key));

/**
 * This is a wrapper class around the LocalStorage class. It enables the storage of JavaScript Plain Objects
 * in LocalStorage.
 */
export class YoshimitsuObjectStorage {
	public constructor(private readonly _keyFn: KeyFunction = _defaultKeyFn, private readonly _storage: Storage = localStorage) {}

	/**
	 * Returns the current value associated with the given key, or null if the given key does not exist.
	 *
	 * @see {@link localStorage.getItem} or {@link sessionStorage.getItem} for more information.
	 */
	public getItem(key: string, options?: YoshimitsuObjectStorageItemOptions): unknown | null;
	public getItem(key: string, storageKey?: string): unknown | null;
	public getItem(key: string, optionsOrStorageKey: YoshimitsuObjectStorageItemOptions | string = {}) {
		const { storageKey } = _optionsOrStorageKeyToOptions(optionsOrStorageKey);

		if (storageKey) {
			const obj = _storageGetObject(storageKey, this._keyFn, this._storage);

			if (typeof obj !== 'object' || obj === null || !(key in obj)) {
				return null;
			}

			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			const value = (obj as Record<string, unknown>)[key];

			if (value === undefined || value === null) {
				return null;
			}

			return value;
		}

		return _storageGetObject(key, this._keyFn, this._storage);
	}

	/**
	 * Removes the key/value pair with the given key, if a key/value pair with the given key exists.
	 *
	 * @see {@link localStorage.removeItem} or {@link sessionStorage.removeItem} for more information.
	 */
	public removeItem(key: string, options?: YoshimitsuObjectStorageItemOptions): void;
	public removeItem(key: string, storageKey?: string): void;
	public removeItem(key: string, optionsOrStorageKey: YoshimitsuObjectStorageItemOptions | string = {}) {
		const { storageKey } = _optionsOrStorageKeyToOptions(optionsOrStorageKey);

		if (storageKey) {
			let obj = _storageGetObject(storageKey, this._keyFn, this._storage);

			if (typeof obj !== 'object' || obj === null) {
				obj = {};
			}

			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			delete (obj as Record<string, unknown>)[key];

			_storageSetObject(storageKey, obj, this._keyFn, this._storage);

			return;
		}

		_storageRemoveObject(key, this._keyFn, this._storage);
	}

	/**
	 * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
	 *
	 * @see {@link localStorage.setItem} or {@link sessionStorage.setItem} for more information.
	 */
	public setItem(key: string, value: unknown, options?: YoshimitsuObjectStorageItemOptions): void;
	public setItem(key: string, value: unknown, storageKey?: string): void;
	public setItem(key: string, value: unknown, optionsOrStorageKey: YoshimitsuObjectStorageItemOptions | string = {}) {
		const { storageKey } = _optionsOrStorageKeyToOptions(optionsOrStorageKey);

		if (storageKey) {
			let obj = _storageGetObject(storageKey, this._keyFn, this._storage);

			if (typeof obj !== 'object' || obj === null) {
				obj = {};
			}

			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			(obj as Record<string, unknown>)[key] = value;

			_storageSetObject(storageKey, obj, this._keyFn, this._storage);

			return;
		}

		_storageSetObject(key, value, this._keyFn, this._storage);
	}
}
