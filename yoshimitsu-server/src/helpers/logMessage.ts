import { MessageEmbed as DiscordMessageEmbed } from 'discord.js';
import { discordWebhookClient } from '@globals';
import { DISCORD_WEBHOOK_CLIENT_AVATAR_URL, DISCORD_WEBHOOK_CLIENT_USERNAME } from '@env';
import { LogMessageOptions } from '@types';
import { pretty } from '@helpers';

const _addFieldsToDiscordMessageEmbed = (discordMessageEmbed: DiscordMessageEmbed, data: Record<string, unknown>) =>
	Object.entries(data).forEach(([k, v]) => {
		let jsonAsString = null;

		try {
			jsonAsString = JSON.stringify(v);
		} catch {}

		if (jsonAsString === null) {
			return;
		}

		for (let i = 0; i < jsonAsString.length; i += 1024) {
			const x = jsonAsString.slice(i, i + 1024);

			discordMessageEmbed.addField(k, x);
		}
	});

const _logMessageOnDiscord = async (options: Partial<Omit<LogMessageOptions, 'notifyOnDiscord'>> = {}): Promise<boolean> => {
	const { data, title, description, color } = options;

	const discordMessageEmbed = new DiscordMessageEmbed();

	if (data) {
		_addFieldsToDiscordMessageEmbed(discordMessageEmbed, data);
	}

	if (title) {
		discordMessageEmbed.setTitle(title);
	}

	if (description) {
		discordMessageEmbed.setDescription(description);
	}

	if (color) {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		discordMessageEmbed.setColor(color as `#${string}`);
	}

	// It seems that Discord has some limitations regarding the size of individual parameters in the request,
	// for example Field Values may only be 1024 bytes (or characters?) large and Message Embed 6000 bytes
	// (or characters?) long.
	//
	// Since there is no clear documentation on this, a try-catch here will simply catch the error because it is
	// not really relevant.
	try {
		await discordWebhookClient.send({
			content: ' ',
			username: DISCORD_WEBHOOK_CLIENT_USERNAME,
			avatarURL: DISCORD_WEBHOOK_CLIENT_AVATAR_URL,
			embeds: [discordMessageEmbed],
		});
	} catch (error: unknown) {
		// See: https://github.com/discordjs/discord.js/issues/3498
		if (error instanceof Error && error.name === 'AbortError') {
			return new Promise((resolve) => setTimeout(() => resolve(_logMessageOnDiscord(options)), 1000));
		}

		console.warn(error);

		return false;
	}

	return true;
};

export const logMessage = ({ data, title, description, color, notifyOnDiscord }: Partial<LogMessageOptions> = {}) => {
	if (!data && !title && !description) {
		console.warn(`Please specify atleast '${data}', '${title}' or '${description}' for '${nameof(logMessage)}' function.`);

		return false;
	}

	console.log(`${title ? title + '\n' : ''}${description ? description + '\n' : ''}${data ? pretty(data) : ''}`);

	if (!notifyOnDiscord) {
		return true;
	}

	return _logMessageOnDiscord({
		data,
		title,
		description,
		color,
	});
};
