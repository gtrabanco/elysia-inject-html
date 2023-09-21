# Description

This is a plugin for elysia that injects html/js code in the response page.

# Installation

```bash
bun add --exact elysia-plugin-inject
```

# Usage

```js
import { Elysia } from 'elysia';
import { InjectPlugin } from 'elysia-plugin-inject';

const app = new Elysia()
  .use(IjectPlugin({
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
  .use(IjectPlugin({
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
