import path from 'path';

export const SERVER_PORT = process.env.PORT ?? 3000;

export const DISCORD_WEBHOOK_CLIENT_USERNAME = 'Yoshimitsu';

export const DISCORD_WEBHOOK_CLIENT_AVATAR_URL = 'https://i.imgur.com/AfFp7pu.png';

export const DISCORD_CHANNEL_BOTLOG_WEBHOOK_ID = '936367273592107149';

export const DISCORD_CHANNEL_BOTLOG_WEBHOOK_TOKEN = 'eh1tQwmMC3H1uAlzDlvBZ0LkRCirMsOYG_eRniKKo6QYkIFuRXQYqIVgN7KYPVWdD8Zc';

export const CONVERSATION_MESSAGES_COLLECTION_NAME = 'conversationMessages';

export const POST_MESSAGES_COLLECTION_NAME = 'postMessages';

export const NAVIGATOR_PROPERTIES_COLLECTION_NAME = 'navigatorProperties';

export const IP_ADDRESSES_COLLECTION_NAME = 'ipAddresses';

export const ACCOUNT_CREDENTIALS_COLLECTION_NAME = 'accountCredentials';

export const EMAIL_ADDRESSES_COLLECTION_NAME = 'emailAddresses';

export const MONGODB_CONNECTION_STRING = `mongodb+srv://doadmin:a75n2VWx86Dq934t@yoshimitsu-db-mongodb-7ed56c5c.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=yoshimitsu-db-mongodb&tls=true&tlsCAFile=${path.join(
	__dirname,
	'ssl/ca-certificate.crt'
)}`;

export const MONGODB_DATABASE_NAME = 'yoshimitsu';
