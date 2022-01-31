import type { SendAPIRequestParametersOption } from './SendAPIRequestParametersOption';

/**
 * Additional options for {@link sendAPIRequest}.
 */
export type SendAPIRequestOptions = {
	interfaceName: string;
	className: string;
	parameters: SendAPIRequestParametersOption;
};
