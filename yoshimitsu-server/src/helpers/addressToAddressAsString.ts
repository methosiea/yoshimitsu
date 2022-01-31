import type { AddressInfo } from 'net';

export const addressToAddressAsString = (address: string | AddressInfo | null, protocol: 'http' | 'https' = 'http') => {
	if (address === null) {
		return `${protocol}://localhost`;
	}

	if (typeof address === 'string') {
		return address;
	}

	if (address.address === '::' || address.address === '127.0.0.1' || address.address === '0.0.0.0') {
		return `${protocol}://localhost:${address.port}`;
	}

	return `${protocol}://${address.address}:${address.port}`;
};
