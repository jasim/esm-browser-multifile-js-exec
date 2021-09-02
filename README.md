# Backend for an ESM multi-module JavaScript browser evaluator.

* Upload static assets (css, jpg) and JavaScript files with POST /#{filename}
* Fetch them back with GET /#{filename}
* JS files are preprocessed with Babel

In the front-end, we run Babel on the initial script that the user evaluates. This is done with JS, on the browser. However, if the code is split into different files, we need to be able to save those files, and return them when the browser's ESM module resolution asks for it. Note that the browser does not support JSX, and so any JS we return must be already precompiled with Babel. This is done by this server.

# Setup

```
npm install @babel/core @babel/cli @babel/preset-react
gem install sinatra mime-types
ruby server.rb
```

