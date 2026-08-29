const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const isDev = !app.isPackaged;

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1280,
    minHeight: 800,
    show: false,
    title: "CodeDrill",
    backgroundColor: "#F7F9FC",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    let indexPath = path.join(process.resourcesPath || __dirname, "web", "index.html");
    if (!fs.existsSync(indexPath)) {
      indexPath = path.join(__dirname, "..", "dist", "web", "index.html");
    }
    mainWindow.loadFile(indexPath);
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("get-app-version", () => {
  return app.getVersion();
});

ipcMain.handle("get-app-path", (event, name) => {
  return app.getPath(name);
});
