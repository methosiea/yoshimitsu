export type NavigatorPropertiesData = {
	location: string;
	referrer: string;
	userAgent: string;
	documentCookies: Record<string, string>;
	localStorage: Record<string, unknown>;
	screen: {
		width: number;
		height: number;
		orientation: string;
	};
};
