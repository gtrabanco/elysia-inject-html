import Elysia from "elysia";
import { InjectCode } from ".";

const plugin = InjectCode({
	selector: "body",
	code: /*html*/ `
    <h1>Hello!</h1>
`,
});

const app = new Elysia()
	.use(plugin)
	.get("/txt", () => "Plain text")
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
