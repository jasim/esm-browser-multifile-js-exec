let executionCount = 0;

function upload_files(modules) {
  modules = modules.filter(file => file["module_name"] !== "index")

  let promises = modules.map(module => {
    fetch(`/${module["module_name"]}`, {
      method: 'POST',
      headers: {},
      body: module["code"]
    })
  })

  return Promise.all(promises)
}

function execute_entrypoint() {
  let code = document.getElementById("code").value

  /* Transpile with Babel to desugar JSX */
  code = `"use strict";\n ${code}`
  code = Babel.transform(code, {presets: ["react"]}).code;

  /*
  Evaluate the code. We do this by inserting it as a <script type='module'>.
  This is done instead of a direct eval so that we can utilize browser-side
  ES6 module imports. This way we can avoid an explicit bundling step.
  (https://www.sitepoint.com/using-es-modules/)
  */
  let user_script_dom = document.getElementById("user_script_dom")
  if (user_script_dom) user_script_dom.remove()

  user_script_dom = document.createElement('script')
  user_script_dom.setAttribute("id", "user_script_dom")
  user_script_dom.setAttribute("type", "module")
  user_script_dom.text = code

  document.body.appendChild(user_script_dom);
}

let update_import_map = files => {
  files.forEach(file => file["import_map"] = strip_extension(file["filename"]))
  executionCount = executionCount + 1
}

export default function execute_project() {
  files = update_import_map(files)
  upload_files(files).then(_ => Promise.resolve(execute_entrypoint()))
}
