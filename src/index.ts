import Elysia, { Context } from "elysia";
import { getPackageNameAndVersion } from "./plugin-name" assert {
	type: "macro",
};

const { name, version } = await getPackageNameAndVersion();

type ElysiaInjectCodeConfig = {
	selector: string;
	code: string | string[];
};

export const InjectCode = (config: ElysiaInjectCodeConfig) =>
	new Elysia({ name, seed: config })
		.decorate("version", version)
		.onAfterHandle(({ response }) => {
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
		});
