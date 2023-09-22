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

const pluginTwo = injectHtml({
	selector: "p",
	setInnerContent: "This text was replace by the pluginTwo",
});

const app = new Elysia()
	.use(plugin)
	.use(pluginTwo)
	.get("/txt", () => "Plain text no rewrite")
	.get(
		"/",
		() =>
			new Response(
				"<!doctype html><html><head><title>Sample</title></head><body><h2>Response</h2><p>This test should be replaced with another instance of the plugin</p></body></html>",
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
