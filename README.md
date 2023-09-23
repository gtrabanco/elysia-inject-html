# Description

This is a plugin for elysia that injects html/js code in the response page.

# Installation

```bash
bun add --exact @gtrabanco/elysia-inject-html
```

# Usage

```js
import { Elysia } from 'elysia';
import { injectHtml } from '@gtrabanco/elysia-inject-html';

const app = new Elysia()
  .use(injectCode({
    selector: 'body'
    code: '<script>alert("Hello World!")</script>'
  }))
  .get('/index.html', () =>
    new Response('<html><body></body></html>', {
      headers: {
        'content-type': 'text/html'
      }
    }))
  .listen(8080);
```

You can provide multiple code with the same selector by providing an array of strings:

```js
const app = new Elysia()
  .use(injectHtml({
    selector: 'body'
    code: [
      '<script>alert("Hello World!")</script>',
      '<script>alert("Hello World 2!")</script>'
    ]
  }))
  .get('/index.html', () =>
    new Response('<html><body></body></html>', {
      headers: {
        'content-type': 'text/html'
      }
    }))
  .listen(8080);
```

## Known limitations

Currently it is not working if you create two similar plugins or two plugins that call `afterHandle` because it will fail. This is confirmed until Elysia 0.7.9.
