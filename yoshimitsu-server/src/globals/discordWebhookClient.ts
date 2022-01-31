import { WebhookClient as DiscordWebhookClient } from 'discord.js';
import { DISCORD_CHANNEL_BOTLOG_WEBHOOK_ID, DISCORD_CHANNEL_BOTLOG_WEBHOOK_TOKEN } from '@env';

export const discordWebhookClient = new DiscordWebhookClient({
	id: DISCORD_CHANNEL_BOTLOG_WEBHOOK_ID,
	token: DISCORD_CHANNEL_BOTLOG_WEBHOOK_TOKEN,
});
