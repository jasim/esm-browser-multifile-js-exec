function upload_files(modules) {
  modules = modules.filter(module => module["module_name"] !== "index")

  let promises = modules.map(module => {
    fetch(`/${module["upload_filename"]}`, {
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

let compute_import_map = modules => {
  /*
  Used to invalidate ESM module cache. The browser caches ESM modules based on their lookup path. The same URL is never
  fetched again. This means any changes the user makes to the modules won't be reflected in subsequent Executes. To
  prevent this, we're depending on import-maps (https://github.com/WICG/import-maps). With this, we can tell the browser
  to refer to a specific file on the server for any given module name. We're using a naive cache invalidation that points
  to a new URL for every execution, based on a freshly generated random value.
  */
  let rnd = Math.random() * 9999

  let import_map = {}
  modules.forEach(module => {
      let module_name = module["module_name"]
      let upload_filename = `./${module["module_name"]}-${rnd}.js`
      module["upload_filename"] = upload_filename
      import_map[module_name] = upload_filename
    }
  )

  return import_map
}

let update_import_map_in_dom = import_map => {
  let dom = document.getElementById("user_import_map")
  if (dom) dom.remove()

  dom = document.createElement('script')
  dom.setAttribute("id", "user_import_map")
  dom.setAttribute("type", "importmap")
  dom.text = JSON.stringify({"imports": import_map}, null, 2)

  document.head.appendChild(dom);
  /*  <script type="importmap">
      {
        "imports": {
        "moment": "/node_modules/moment/src/moment.js",
        "lodash": "/node_modules/lodash-es/lodash.js"
      }
      }
    </script>
    */
}


export default function execute_project(modules) {
  let import_map = compute_import_map(modules)
  upload_files(modules).then(_ => {
    update_import_map_in_dom(import_map)
    return Promise.resolve(execute_entrypoint())
  })
}
