const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),
  getAppPath: (name) => ipcRenderer.invoke("get-app-path", name),
  platform: process.platform,
});
