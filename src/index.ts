import Elysia from "elysia";
import { getPackageName } from "./plugin-name" assert { type: "macro" };

// I made this workaround because without this workaround only works for the first
// added plugin.
let handlers: Array<ConfigAppendPrepend | ConfigSetInnerContent> | undefined;
if (typeof handlers === typeof undefined)
	handlers = [] as Array<ConfigAppendPrepend | ConfigSetInnerContent>;

const name = await getPackageName();

type ConfigSetInnerContent = {
	selector: string;
	setInnerContent: string;
	replace: string;
};

type ConfigAppendPrepend = {
	selector: string;
	append?: string | string[];
	prepend?: string | string[];
};

export type InjectCodeConfig =
	| ConfigAppendPrepend
	| ConfigSetInnerContent
	| Array<ConfigAppendPrepend | ConfigSetInnerContent>;

const handleInjection = (
	config: ConfigAppendPrepend | ConfigSetInnerContent,
	element: HTMLRewriterTypes.Element,
) => {
	// Replace content
	const possibleReplaceConfigType = config as ConfigSetInnerContent;
	if (
		possibleReplaceConfigType.setInnerContent ||
		possibleReplaceConfigType.replace
	) {
		if (possibleReplaceConfigType.replace) {
			element.replace((config as ConfigSetInnerContent).replace, {
				html: true,
			});
			return;
		}

		if (possibleReplaceConfigType.setInnerContent)
			element.setInnerContent(
				(config as ConfigSetInnerContent).setInnerContent,
				{ html: true },
			);
		return;
	}

	// Append and prepend
	const { append = [], prepend = [] } = config as ConfigAppendPrepend;
	const appendArray = Array.isArray(append) ? append : [append];
	const prependArray = Array.isArray(prepend) ? prepend : [prepend];

	appendArray.forEach((a) => {
		element.append(a, { html: true });
	});

	prependArray.forEach((p) => {
		element.prepend(p, { html: true });
	});
};

export const injectHtml = (config: InjectCodeConfig) => {
	handlers ??= [];
	if (!Array.isArray(config)) {
		handlers.push(config);
	} else {
		config.forEach((c) => handlers?.push(c));
	}

	return new Elysia({ name, seed: JSON.stringify(config) }).onAfterHandle(
		// Next function should not be async function
		async ({ response }) => {
			// Woraround modification, commented line 81 should be the good one
			const { headers, status, statusText } = response as Response;
			// const { headers } = response as Response;

			const contentType = headers?.get("content-type") ?? "";
			if (!contentType.includes("html")) return; // Not rewrite if not html

			const rw = new HTMLRewriter();
			// In the version that was not working I used a variable which has config as array if it is not
			// const handlers = Array.isArray(config)? config : [config];
			handlers?.forEach(
				(
					c: Exclude<
						InjectCodeConfig,
						Array<ConfigAppendPrepend | ConfigSetInnerContent>
					>,
				) => {
					rw.on(c.selector, {
						element(element) {
							handleInjection(c, element);
						},
					});
				},
			);

			// Workaround, commented line 109 should be the good one
			return rw.transform(
				new Response(await (response as Response).text(), {
					headers,
					status,
					statusText,
				}),
			);

			// return rw.transform(response as Response);
		},
	);
};
