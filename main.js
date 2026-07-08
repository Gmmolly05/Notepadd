import { app, screen, ipcMain, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { loadTasks, saveTasks } from './src/storage/tasks.js';

const dataPath = path.join(app.getPath('userData'), 'tasks.json');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ipcMain.handle('get-tasks', () => loadTasks(dataPath));
ipcMain.handle('set-tasks', (event, tasks) => saveTasks(dataPath, tasks));
ipcMain.handle('minimize-window', () => BrowserWindow.getFocusedWindow().minimize());
ipcMain.handle('close-window', () => BrowserWindow.getFocusedWindow().close());

const createWindow = () => {

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const windowHeight = 500;
    const windowWidth = 300;

    const margin = 10;

    const win = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        x: width - windowWidth - margin,
        y: height - windowHeight - margin,
        frame: false,
        alwaysOnTop: true,
        transparent: true,

        webPreferences: {
            preload: path.join(
                __dirname,
                "preload.js"
            )
        }
    });

    win.loadFile('index.html');
}

function checkDataFile() {
    if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(dataPath, "[]");
    }
}

app.whenReady().then(() => {

    checkDataFile();

    const list = loadTasks(dataPath);
    //console.log(list);

    createWindow();

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

})

