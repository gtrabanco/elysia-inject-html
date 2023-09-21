import Elysia from "elysia";
import { getPackageName } from "./plugin-name" assert { type: "macro" };

const name = await getPackageName();

export type InjectCodeConfig = {
	selector: string;
	code: string | string[];
};

export const injectHtml = (config: InjectCodeConfig) =>
	new Elysia({ name, seed: config, scoped: true }).onAfterHandle(
		({ response }) => {
			const { headers } = response as Response;
			const contentType = headers?.get("content-type") ?? "";

			if (!contentType.includes("html")) return; // Not rewrite if not html

			const rw = new HTMLRewriter();
			rw.on(config.selector, {
				element(element) {
					const codes = Array.isArray(config.code)
						? config.code
						: [config.code];
					codes.forEach((code) => element.append(code, { html: true }));
				},
			});

			return rw.transform(response as Response);
		},
	);
