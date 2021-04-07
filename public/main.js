const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  shell,
  dialog,
  ipcMain,
} = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const Dexie = require("dexie");
// require("dexie-export-import");

// const { get, set } = require("idb-keyval");

const fs = require("fs");

let mainWindow = null;

//create back and forward event to replicate back and forward button at browser
const backEvent = () => {
  console.log("Move backward");
  let content = mainWindow.webContents;
  content.canGoBack() && content.goBack();
};

const forwardEvent = () => {
  console.log("Move forward");
  let content = mainWindow.webContents;
  content.canGoForward() && content.goForward();
};

const updateHandler = async () => {
  //shell.showItemInFolder(getAppRoot());
  // shell.openPath("C:\\temp");
  //const fileHandler = await get('file');

  // const [fileHandle] = getAppRoot();
  // console.log(fileHandle);
  // await set("file", fileHandle);

  //let filepath = "c://temp//package.json";

  //   dialog.showOpenDialog(  (filename) => {
  //     if (filename === undefined) {
  //       console.log("no file selected");
  //       return;
  //     }
  //     console.log(filename);
  //     fs.readFile(filename, "utf-8", (err, data) => {
  //       if (err) {
  //         alert("An error occured reading the file: " + err.message);
  //         return;
  //       }

  //       console.log("The file content is: " + data);
  //     });
  //   });
  // } catch (error) {
  //   console.log(error.name, error.message);
  // }

  // dialog
  //   .showOpenDialog({ properties: ["openFile"] })
  //   .then((result) => {
  //     console.log(result.filePaths);

  //     fs.readFile(result.filePaths[0], "utf-8", (err, data) => {
  //       if (err) {
  //         alert("An error occured reading the file: " + err.message);
  //         return;
  //       }

  //       console.log("save into indexeddb...");
  //     });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  fs.readFile("c:\\temp\\blob150.json", "utf-8", (err, data) => {
    if (err) {
      alert("An error occured reading the file: " + err.message);
      return;
    }

    console.log("reading file...", data);
    ipcMain.on("asynchronous-message", (event, arg) => {});
  });
};

// create custom menu. Need more than 1 pages to test
const customMenu = [
  {
    label: "Back",
    toolTip: "Alt + <-", // available on macOS
    click: backEvent,
  },
  {
    label: "Forward",
    toolTip: "Alt + <-", //available on macOS
    click: forwardEvent,
  },
  {
    label: "Update",
    click: updateHandler,
  },
];
const menu = Menu.buildFromTemplate(customMenu);
Menu.setApplicationMenu(menu);

//create keyboard shortcut. Alt+left for backward and Alt+Righ for forward
const registerShortCut = () => {
  globalShortcut.register("Alt+Left", backEvent);
  globalShortcut.register("Alt+Right", forwardEvent);
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  });

  // in development mode, open dev tools.
  // if (isDev) mainWindow.webContents.openDevTools();
  mainWindow.webContents.openDevTools();

  //mainWindow.loadFile('index.html');
  //mainWindow.loadURL('http://localhost:3000/');
  //mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));

  registerShortCut();
}

// app.whenReady().then(createWindow);
app.on("ready", () => {
  createWindow();
  // renderer();
  // readFile();
  //readDirectory();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0 || mainWindow === null) {
    createWindow();
    let approot = getAppRoot();
    console.log(approot);
  }
});

function getAppRoot() {
  if (process.platform === "win32") {
    return path.join(app.getAppPath(), "/../../../");
  } else {
    return path.join(app.getAppPath(), "/../../../../");
  }
}

function readFile() {
  fs.readFile("c:\\temp\\blob150.json", "utf-8", (err, data) => {
    if (err) {
      alert("An error occured reading the file: " + err.message);
      return;
    }

    console.log("reading file...", data);
  });
}

function readDirectory() {
  fs.readdir("c:\\temp", (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    files.forEach((file) => {
      console.log(typeof file);
      if (file === "blob150.json") {
        console.log("selected file:" + file);
        testExportImport(file);
      }
    });
  });
}

async function testExportImport(file) {
  // try {

  console.log(``);
  console.log(`Import() : dexie-export-import`);
  console.log(`=========`);
  console.log(`Import json file into indexedDB! ...`);
  // let time = performance.now();
  let staticOption = {
    progressCallback: (progress) => {
      console.log(`Total tables: ${progress.totalTables}`);
      console.log(
        `Processing ${progress.completedRows} / ${progress.totalRows}`
      );
    },
  };

  // await importDB(file, staticOption)
  await Dexie.import(file)
    .then((result) => {
      // console.log(
      //   `Bulk Put operations done. Took ${Math.round(
      //     performance.now() - time
      //   )} milliseconds.`
      // );
    })
    .catch("TimeoutError", (e) => {
      console.log(e.name + ": " + e.message);

      switch (e && e.name) {
        case "BulkError":
          console.log("From total document," + e.failures.length + "failed");
          break;
        case "MissingAPIError":
          console.log("Couldn't find indexedDB API");
          break;
        case "SecurityError":
          document.getElementById("log").style = "display:none";
          document.getElementById("safari-version").style = "display:";
          break;
        default:
          console.log(e);
          break;
      }
    });
  // console.log(
  //   `Bulk Put operations done. Took ${Math.round(
  //     performance.now() - time
  //   )} milliseconds.`
  // );

  //
  let fileInfo = {
    name: file.name,
    size: file.size,
    lastModified: file.lastModified,
  };

  let db = new Dexie("Logs");
  db.version(1).stores({
    logs: "++, name",
  });
  await db.open();
  await db.logs.add(fileInfo);

  console.log(`All Done.`);
}

// function renderer() {
//   console.log(
//     "make a worker: ",
//     path.resolve(__dirname, "./databaseworker.js")
//   );

//   // if (isDev) {
//   var worker = new Worker("./databaseworker.js");
//   // } else {
//   // var  worker = new Worker(path.resolve(__dirname, "./databaseworker.js"));
//   // }

//   worker.onmessage = function (event) {
//     console.log("Database worker process is... ", event.data);
//     worker.terminate();
//   };

//   worker.onerror = function (event) {
//     console.error(event.message, event);
//   };
// }

ipcMain.on("getdata", (event, args) => {
  console.log("process request: pong");
});
