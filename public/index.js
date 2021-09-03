'use strict'

import React, {useState} from "https://cdn.skypack.dev/react@17.0.1";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";

import execute_project from "./execute_project.js";
import example_code from "./example_code.js";

function App() {
  let [files, setFiles] = useState(() => example_code)

  let delete_module_ui = module => {
    let name = module["module_name"]
    if (name === "index") {
      return <p>entrypoint</p>
    }

    let onClick = _ => setFiles(files => files.filter(file => file["module_name"] !== name))
    return <button className={"text-lg bg-red-600 text-white px-1"} onClick={onClick}>Delete</button>
  }

  let update_code = (module_name, code) => {
    setFiles(files => files.map(file => {
        if (file["module_name"] == module_name) {
          return {...file, code: code}
        } else return file
      })
    )
  }

  let filesView =
    files.map(file => {
      return (
        <div key={file["module_name"]} className={"mb-2 w-full"}>
          <div className={"flex items-end justify-between"}>
            <h3 className={"text-lg mb-0 pb-0 font-mono"}><span
              className={"bg-white p-2"}> ./{file["module_name"]}.js</span></h3>
            {delete_module_ui(file)}
          </div>
          <textarea id="code" className="block w-full h-80 p-4 font-mono text-sm"
                    autoFocus value={file["code"]} onChange={e => update_code(file["module_name"], e.target.value)}/>
        </div>
      )
    })

  return (
    <div>
      <div className={"grid grid-cols-3 gap-x-8"}>
        {filesView}
        <div key={"add_new_file"}
             className={"mb-2 w-full h-full bg-gray-300 relative hover:bg-gray-800 text-green-900 hover:text-white"}>

          <input className={"absolute block mb-2 w-full p-4 h-8 text-lg hover:text-black text-black"} type={"text"}
                 placeholder={"Name of new file"}/>

          <button className={"flex justify-center items-center h-full w-full"}
                  onClick={_ => 0}>
            <p className={""} style={{"fontSize": "92px"}}>+</p>
          </button>
        </div>
      </div>
      <button className="bg-gray-700 text-gray-50 px-4 py-2 text-xl" onClick={_ => execute_project(files)}>Execute!
        (runs index.js)
      </button>
    </div>
  )
}


function startApp() {
  ReactDOM.render(<App/>, document.getElementById('app_react_root'));
}

window.addEventListener('load', _ => startApp())
