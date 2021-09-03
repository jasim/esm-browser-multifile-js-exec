'use strict'

import React, {useState} from "https://cdn.skypack.dev/react@17.0.1";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";
import ExampleProject from "./exampleProject.js";
import {uploadFiles} from "./uploadFiles.js";
function executeScript() {
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
  let userScript = document.getElementById("userScript")
  if (userScript) userScript.remove()

  userScript = document.createElement('script')
  userScript.setAttribute("id", "userScript")
  userScript.setAttribute("type", "module")
  userScript.text = code

  document.body.appendChild(userScript);
}

function App() {
  let [files, setFiles] = useState(() => ExampleProject)

  let executeProject = () => {
    uploadFiles(files).then(_ => Promise.resolve(executeScript()))
  }

  let deleteFileView = filename => {
    let onClick = _ => setFiles(files => files.filter(file => file["filename"] != filename))
    return <button className={"text-sm red-900 mb-2"} onClick={onClick}>Delete</button>
  }

  let filesView =
    files.map(file => {
      return (
        <div key={file["filename"]} className={"mb-2"}>
          <h3 className={"text-lg mb-0 pb-0"}>{file["filename"]}</h3>
          {deleteFileView(file["filename"])}
          <textarea id="code" className="block mb-8 w-3/4 h-80 border border-black p-4 font-mono"
                    autoFocus>{file["code"]}</textarea>
        </div>
      )
    })

  return (
    <div>
      {filesView}
      <button className="bg-gray-100 p-4 w-32" onClick={_ => executeProject()}>Run index.js</button>
    </div>
  )
}

function startApp() {
  ReactDOM.render(<App/>, document.getElementById('app_react_root'));
}

window.addEventListener('load', _ => startApp())
