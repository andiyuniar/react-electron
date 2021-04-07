import "./App.css";
import { useEffect } from "react";
import FileAccess from "./components/FileAccess";

const { ipcRenderer } = require("electron");

// import Todo from './components/Todo';
// import TestUpload from './components/Testupload';

function App() {
  // useEffect(() => {
  //   ipcRenderer.send("getdata", "ping");
  //   console.log("use effect run");
  // }, []);
  return (
    <div className="App">
      <header className="App-header">File Access</header>
      <FileAccess />
    </div>
  );
}

export default App;
