'use strict'

import React, {useState} from "https://cdn.skypack.dev/react@17.0.1";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";

import execute_project from "./execute_project.js";
import example_code from "./example_code.js";

function App() {
  let [files, setFiles] = useState(() => example_code)

  let delete_module_ui = module_name => {
    let onClick = _ => setFiles(files => files.filter(file => file["module_name"] != module_name))
    return <button className={"text-sm red-900 mb-2"} onClick={onClick}>Delete</button>
  }

  let filesView =
    files.map(file => {
      return (
        <div key={file["module_name"]} className={"mb-2"}>
          <h3 className={"text-lg mb-0 pb-0"}>{file["module_name"]}</h3>
          {delete_module_ui(file["module_name"])}
          <textarea id="code" className="block mb-8 w-3/4 h-80 border border-black p-4 font-mono"
                    autoFocus>{file["code"]}</textarea>
        </div>
      )
    })

  return (
    <div>
      {filesView}
      <button className="bg-gray-100 p-4 w-32" onClick={_ => execute_project(files)}>Run index.js</button>
    </div>
  )
}


function startApp() {
  ReactDOM.render(<App/>, document.getElementById('app_react_root'));
}

window.addEventListener('load', _ => startApp())
