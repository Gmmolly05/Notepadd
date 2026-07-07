import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("storage", {
    getTasks: () => {
        return ipcRenderer.invoke("get-tasks");
    }
});