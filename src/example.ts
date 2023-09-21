import Elysia from "elysia";
import { injectHtml } from "./index.ts";

const plugin = injectHtml([
	{
		selector: "body",
		prepend: /*html*/ `
    <h1>Hello!</h1>
`,
		append: /*html*/ `
		<h3>World!</h3>
		<footer>Bye!</footer>
`,
	},
	{
		selector: "title",
		setInnerContent: "Reemplazed window title",
	},
]);

const app = new Elysia()
	.use(plugin)
	.get("/txt", () => "Plain text no rewrite")
	.get(
		"/",
		() =>
			new Response(
				"<!doctype html><html><head><title>Sample</title></head><body><h2>Response</h2></body></html>",
				{
					headers: {
						"content-type": "text/html; charset=utf-8",
					},
				},
			),
	)
	.on("start", ({ app: { server } }) => {
		console.log(`Server started at http://${server.hostname}:${server.port}`);
	})
	.listen(3000);
