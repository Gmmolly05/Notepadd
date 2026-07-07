const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("storage", {
    getTasks: () => {
        return ipcRenderer.invoke("get-tasks");
    },

    saveTasks: (tasks) => {
        return ipcRenderer.invoke("set-tasks", tasks);
    }

});