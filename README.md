# ESM multi-module JavaScript browser evaluator.

When the user executes a single-file project, it is transpiled with Babel in the browser, and executed with `type="module"` so that browser-native ES module resolution kicks in. Thanks to ES modules, we can use a CDN like Skypack and depend on npm libraries like momentjs and React. No build step is necessary.

To make it possible to write React and JSX, we also transpile the code with Babel right inside the browser. This is done with [Babel Standalone](https://babeljs.io/docs/en/babel-standalone).

This approach is demonstrated in [Basic JS React Browser eval](https://github.com/jasim/basic-js-react-browser-eval).

However, to support multi-file projects, we need a stateful back-end system to serve user-created module files.

## The need for a server

When a browser executes code that refers to an ES module, it first downloads it from the URL, and then caches it for future use. This is straightforward if we're referring to libraries available in a public CDN. Consider this code:

```html
<script type="module">
import React, { useState } from "https://cdn.skypack.dev/react@17.0.1";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";

import {ClickTracker} from "./ClickTracker.js";

ReactDOM.render(<ClickTracker />, document.getElementById('react_root'));
</script>
```

The "module" attribute in the `script` tag tells the browser that this is an ES module. This means any `import` statements inside the code should be resolved using browser's ESM resolver.

Here the React and ReactDOM libraries are available in the CDN. But it is not the case for `ClickTracker`. It is not enough that the code for this module exists somewhere in our browser - the browser will try to fetch it from the host path (being a relative URL). If we're serving the site from example.com, then the browser ESM resolver does a GET to "example.com/ClickTracker.js".

This makes it necessary for us to persist the different module files created by the user into a server. In this project we've implemented a barebones Sinatra webserver to do this.

## A proof-of-concept protocol

A project is a set of JavaScript files. Each of these files can refer to others using the ES module `import` statement.

When the user hits "Execute" in our sandbox, we upload all the module files to the server. And when the browser does a GET during ES module resolution, these files are returned.

The server also transpiles each module file with Babel before returning to the browser. This lets us write JSX and React in any module file, and not just the entrypoint.

# Project Setup

```
npm install @babel/core @babel/cli @babel/preset-react
gem install sinatra mime-types
ruby server.rb
```

# Development

```
ruby server.rb
# open localhost:4567 in the browser
```
