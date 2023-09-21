import Elysia from "elysia";
import { getPackageName } from "./plugin-name" assert { type: "macro" };

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

export const injectHtml = (config: InjectCodeConfig) =>
	new Elysia({ name, seed: config }).onAfterHandle(({ response }) => {
		const { headers } = response as Response;
		const contentType = headers?.get("content-type") ?? "";
		if (!contentType.includes("html")) return; // Not rewrite if not html

		const rw = new HTMLRewriter();
		const configs = Array.isArray(config) ? config : [config];
		configs.forEach((c) => {
			rw.on(c.selector, {
				element(element) {
					handleInjection(c, element);
				},
			});
		});
		return rw.transform(response as Response);
	});
