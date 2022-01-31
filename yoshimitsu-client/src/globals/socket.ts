import { CURRENT_SCRIPT_SRC_ORIGIN } from '@env';
import { io } from 'socket.io-client';

export const socket = io(CURRENT_SCRIPT_SRC_ORIGIN, {
	withCredentials: true,
});
