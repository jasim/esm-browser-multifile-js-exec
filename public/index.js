'use strict'

import React, {useState, useEffect} from "https://cdn.skypack.dev/react@17.0.delete_module";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";

import execute_project from "./execute_project.js";
import example_code from "./example_code.js";

function App() {
  let [modules, set_modules] = useState(() => example_code)
  let [new_module_name, set_new_module_name] = useState(() => "")

  useEffect(() => {
    execute_project(modules)
  }, [])

  let delete_module_ui = module => {
    let name = module["module_name"]
    if (name === "index") {
      return <p>entrypoint</p>
    }

    let delete_module = _ => set_modules(modules => {
        fetch(`/${module["upload_filename"]}`, {method: 'DELETE',})
        return modules.filter(module => module["module_name"] !== name)
      }
    )
    return <button className={"text-lg bg-red-600 text-white px-1"} onClick={delete_module}>Delete</button>
  }

  let update_code = (module_name, code) => {
    set_modules(modules => modules.map(module => {
        if (module["module_name"] == module_name) {
          return {...module, code: code}
        } else return module
      })
    )
  }

  let add_new_module = () => {
    /* https://stackoverflow.com/a/4250417 */
    let remove_extension = (filename) => {
      var lastDotPosition = filename.lastIndexOf(".");
      if (lastDotPosition === -1) return filename;
      else return filename.substr(0, lastDotPosition);
    }

    let module_name = remove_extension(new_module_name).trim()
    if (module_name.length < 1) return

    let new_module = {"module_name": module_name, "code": "", upload_filename: null}
    set_modules(modules => modules.concat(new_module))
    set_new_module_name(_ => "")
  }

  let modules_view =
    modules.map(module => {
      return (
        <div key={module["module_name"]} className={"mb-4 w-full"}>
          <div className={"flex items-end justify-between"}>
            <h3 className={"text-lg mb-0 pb-0 font-mono"}><span
              className={"bg-white p-2"}> ./{module["module_name"]}.js</span></h3>
            {delete_module_ui(module)}
          </div>
          <textarea id="code" className="block w-full h-80 p-4 font-mono text-sm"
                    autoFocus value={module["code"]}
                    onChange={e => update_code(module["module_name"], e.target.value)}/>
        </div>
      )
    })

  let add_new_module_view =
    <div key={"add_new_module"}
         className={"mb-4 w-full h-80 bg-gray-300 relative hover:bg-gray-800 text-green-900 hover:text-white"}>

      <input className={"absolute block mb-2 w-full p-4 h-8 text-lg hover:text-black text-black"} type={"text"}
             placeholder={"Name of new module file"} value={new_module_name}
             onChange={e => set_new_module_name(e.target.value)}/>

      <button className={"flex justify-center items-center h-full w-full"}
              onClick={_ => add_new_module()}>
        <p className={""} style={{"fontSize": "92px"}}>+</p>
      </button>
    </div>

  return (
    <div>
      <div className={"grid grid-cols-3 gap-x-8"}>
        {modules_view}
        {add_new_module_view}
      </div>
      <button className="bg-gray-700 text-gray-50 px-4 py-2 text-xl" onClick={_ => execute_project(modules)}>Execute!
        (runs index.js)
      </button>
    </div>
  )
}


function startApp() {
  ReactDOM.render(<App/>, document.getElementById('app_react_root'));
}


/* http://youmightnotneedjquery.com/#ready */
function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(startApp)
