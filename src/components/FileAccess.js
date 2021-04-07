import { get, set } from "idb-keyval"; //"https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js";
import React from "react";
// require("dotenv").config();

const FileAccess = () => {
  const [data1, setData1] = React.useState("");
  const [dir, setDir] = React.useState("");

  const buttonFileHandler = async (e) => {
    try {
      const fileHandleOrUndefined = process.env.REACT_APP_FILENAME; //await get("file");

      if (fileHandleOrUndefined) {
        // pre1.textContent = `Retrieved file handle "${fileHandleOrUndefined.name}" from IndexedDB.`;
        setData1(
          `Retrieved file handle "${fileHandleOrUndefined}" from IndexedDB.`
        );
        // return;
      }
      const [fileHandle] = await window.showOpenFilePicker();
      await set("file", fileHandle);
      // pre1.textContent = `Stored file handle for "${fileHandle.name}" in IndexedDB.`;
      let permission = await verifyPermission(fileHandle, true);
      console.log(permission);
    } catch (error) {
      alert(error.name, error.message);
    }
  };

  const buttonDirectoryHandler = async (e) => {
    try {
      //const directoryHandleOrUndefined = await get("directory");
      const directoryHandleOrUndefined = process.env.REACT_APP_DIRECTORYNAME;
      console.log(process.env.REACT_APP_DIRECTORYNAME);
      if (directoryHandleOrUndefined) {
        // pre2.textContent = `Retrieved directroy handle "${directoryHandleOrUndefined.name}" from IndexedDB.`;
        setDir(
          `Retrieved directroy handle "${directoryHandleOrUndefined}" from IndexedDB.`
        );
        return;
      }
      const directoryHandle = await window.showDirectoryPicker();
      console.log(directoryHandle);
      await set("directory", directoryHandle);
      // pre2.textContent = `Stored directory handle for "${directoryHandle.name}" in IndexedDB.`;
    } catch (error) {
      alert(error.name, error.message);
    }
  };

  async function verifyPermission(fileHandle, readWrite) {
    const options = {};
    if (readWrite) {
      options.mode = "readwrite";
    }
    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === "granted") {
      return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === "granted") {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
  }

  return (
    <div>
      <pre id="file">{data1}</pre>
      <pre id="directory">{dir}</pre>
      <button id="buttonfile" onClick={buttonFileHandler}>
        File
      </button>
      <button id="buttondirectory" onClick={buttonDirectoryHandler}>
        Directory
      </button>
    </div>
  );
};

export default FileAccess;

// const pre1 = document.querySelector("pre.file");
// const pre2 = document.querySelector("pre.directory");
// const button1 = document.querySelector("button.file");
// const button2 = document.querySelector("button.directory");

// // File handle
// button1.addEventListener("click", async () => {
//   try {
//     const fileHandleOrUndefined = await get("file");
//     if (fileHandleOrUndefined) {
//       pre1.textContent = `Retrieved file handle "${fileHandleOrUndefined.name}" from IndexedDB.`;
//       return;
//     }
//     const [fileHandle] = await window.showOpenFilePicker();
//     await set("file", fileHandle);
//     pre1.textContent = `Stored file handle for "${fileHandle.name}" in IndexedDB.`;
//   } catch (error) {
//     alert(error.name, error.message);
//   }
// });

// // Directory handle
// button2.addEventListener("click", async () => {
//   try {
//     const directoryHandleOrUndefined = await get("directory");
//     if (directoryHandleOrUndefined) {
//       pre2.textContent = `Retrieved directroy handle "${directoryHandleOrUndefined.name}" from IndexedDB.`;
//       return;
//     }
//     const directoryHandle = await window.showDirectoryPicker();
//     await set("directory", directoryHandle);
//     pre2.textContent = `Stored directory handle for "${directoryHandle.name}" in IndexedDB.`;
//   } catch (error) {
//     alert(error.name, error.message);
//   }
// });
