const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("storage", {
    getTasks: () => {
        return ipcRenderer.invoke("get-tasks");
    }
});