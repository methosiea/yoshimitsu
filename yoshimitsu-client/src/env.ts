export const DEVELOPMENT_MODE_INCLUDED_USERNAMES: string[] = ['metho', 'beam0004'];

export const PRODUCTION_MODE_EXCLUDED_USERNAMES: string[] = [];

export const ACCOUNT_CREDENTIALS_SEARCH_EXCLUDED_USERNAMES: string[] = ['metho'];

export const CURRENT_SCRIPT_SRC_ORIGIN = process.env.CURRENT_SCRIPT_SRC_ORIGIN ?? 'http://localhost:3000';

export const CURRENT_SCRIPT_SRC = process.env.CURRENT_SCRIPT_SRC ?? 'http://localhost:3000/yoshimitsu-client.js';

export const EXTERNAL_SCRIPT_SRC = process.env.EXTERNAL_SCRIPT_SRC ?? 'http://localhost:3000/yoshimitsu-external.js';
