/**
 * Formats plain object.
 */
export const pretty = (obj: Record<string, unknown>, _indent = 0) => {
	let str = '';

	const t = '\t'.repeat(_indent);

	Object.entries(obj).forEach(([k, v]) => {
		if (typeof v === 'object' && v !== null) {
			str += t;
			str += `- ${k} {\n`;
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			str += pretty(v as Record<string, unknown>, _indent + 1);
			str += t;
			str += `}\n`;

			return;
		}

		let jsonAsString = null;

		try {
			jsonAsString = JSON.stringify(v);
		} catch {}

		str += `${t}- ${k} = ${jsonAsString || ''}\n`;
	});

	return str;
};
