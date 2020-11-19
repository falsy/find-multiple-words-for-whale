import * as React from "react";
import * as ReactDOM from "react-dom";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <Dashboard />
  )
}

ReactDOM.render(<App />, document.getElementById("wrap"));