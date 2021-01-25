const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow = null;

//create back and forward event to replicate back and forward button at browser
const backEvent = () => {
  console.log('Move backward');
  let content = mainWindow.webContents;
  content.canGoBack() && content.goBack();
}

const forwardEvent = () => {
  console.log('Move forward');
  let content = mainWindow.webContents;
  content.canGoForward() && content.goForward();
}

// create custom menu. Need more than 1 pages to test
const customMenu = [{
  label: 'Back',
  toolTip: 'Alt + <-', // available on macOS
  click: backEvent
}, {
  label: 'Forward',
  toolTip: 'Alt + <-', //available on macOS
  click: forwardEvent
}]
const menu = Menu.buildFromTemplate(customMenu);
Menu.setApplicationMenu(menu);

//create keyboard shortcut. Alt+left for backward and Alt+Righ for forward
const registerShortCut = () => {
  globalShortcut.register('Alt+Left', backEvent);
  globalShortcut.register('Alt+Right', forwardEvent);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // in development mode, open dev tools.
  if (isDev) mainWindow.webContents.openDevTools();

  //mainWindow.loadFile('index.html');
  //mainWindow.loadURL('http://localhost:3000/');
  //mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);

  registerShortCut();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0 || mainWindow === null){
    createWindow()
  }
})