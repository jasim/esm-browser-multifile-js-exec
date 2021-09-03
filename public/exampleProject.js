const index_code = `import React, { useState } from "https://cdn.skypack.dev/react@17.0.1";
import ReactDOM from "https://cdn.skypack.dev/react-dom@17.0.1";

import {ClickTracker} from "./ClickTracker.js";

ReactDOM.render(<ClickTracker />, document.getElementById('user_react_root'));
`;

const click_tracker_code = `import React, { useState } from "https://cdn.skypack.dev/react@17.0.1"

export function ClickTracker() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button className="blue font-bold underline" onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
`

export default [
  {filename: "index.js", code: index_code},
  {filename: "ClickTracker.js", code: click_tracker_code}
]
