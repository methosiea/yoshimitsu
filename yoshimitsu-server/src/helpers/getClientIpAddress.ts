import type { Socket } from 'socket.io';

export const getClientIpAddresses = (socket: Socket) => {
	const forwardedFor = socket.handshake.headers['x-forwarded-for'];

	const clientIpAddresses =
		forwardedFor && forwardedFor.length > 0
			? Array.isArray(forwardedFor)
				? forwardedFor
				: forwardedFor.split(',')
			: [socket.handshake.address];

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const mainClientIpAddress = clientIpAddresses.shift()!;

	return { mainClientIpAddress, clientIpAddresses };
};
