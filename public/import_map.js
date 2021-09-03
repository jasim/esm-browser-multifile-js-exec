/*
NOTE: This is obsolete and is not being used.

Since we're creating a new iframe for each execution, the browser fetches all
ESM modules freshly. It seems ESM cache is applicable only within a frame.
*/

/*
Build an Import Map DOM.
https://github.com/WICG/import-maps

eg:
  <script type="importmap">
    {
      "imports": {
        "moment": "/node_modules/moment/src/moment.js",
        "lodash": "/node_modules/lodash-es/lodash.js"
      }
    }
  </script>
*/


let compute = modules => {
  /*
  Used to invalidate ESM module cache. The browser caches ESM modules based on their lookup path. The same URL is never
  fetched again. This means any changes the user makes to the modules won't be reflected in subsequent Executes. To
  prevent this, we're depending on import-maps. With this, we can tell the browser to refer to a specific file on the
  server for any given module name. We're using a naive cache invalidation that points to a new URL for every
  execution, based on a freshly generated random value.
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

  return [modules, import_map]
}

export default function build_dom(modules) {
  let im
  [modules, im] = compute(modules)
  let im_dom = document.createElement('script')
  im_dom.setAttribute("id", "user_import_map")
  im_dom.setAttribute("type", "importmap")
  im_dom.text = JSON.stringify({"imports": im}, null, 2)
  return [modules, im_dom]
}
