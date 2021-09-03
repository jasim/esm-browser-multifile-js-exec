function upload_files(modules) {
  modules = modules.filter(module => module["module_name"] !== "index")

  let promises = modules.map(module => {
    let upload_filename = module["module_name"] + ".js"
    fetch(`/${upload_filename}`, {
      method: 'POST',
      headers: {},
      body: module["code"]
    })
  })

  return Promise.all(promises)
}

function build_js_entrypoint_dom(entrypoint) {
  let code = entrypoint["code"]

  /* Transpile with Babel to desugar JSX */
  code = `"use strict";\n ${code}`
  code = Babel.transform(code, {presets: ["react"]}).code;

  /*
  We get the browser to evaluate the user code by inserting it as a <script type='module'>.
  This is done instead of a direct eval so that we can utilize browser-side
  ES6 module imports. This way we can avoid an explicit bundling step.
  (https://www.sitepoint.com/using-es-modules/)
  */

  let user_script_dom = document.createElement('script')
  user_script_dom.setAttribute("id", "user_script_dom")
  user_script_dom.setAttribute("type", "module")
  user_script_dom.text = code

  return user_script_dom
}

let build_execution_iframe = (modules) => {
  let iframe_dom = document.getElementById("user_iframe_dom")
  if (iframe_dom) user_iframe_dom.remove()

  let entrypoint = modules.find(module => module["module_name"] === "index")
  let user_script_dom = build_js_entrypoint_dom(entrypoint)
  let contents = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Execute JS</title>
</head>
<body>
  <div id="react_root"></div>
  ${user_script_dom.outerHTML}
</body>
</html>
`;

  iframe_dom = document.createElement("iframe");
  iframe_dom.setAttribute("id", "user_iframe_dom");
  iframe_dom.srcdoc = contents
  return iframe_dom
}

export default function execute_project(modules) {
  upload_files(modules).then(_ => {
    user_iframe_dom = build_execution_iframe(modules)
    document.body.appendChild(user_iframe_dom);

    return Promise.resolve(true)
  })
}
