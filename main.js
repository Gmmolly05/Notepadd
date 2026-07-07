import { app, screen, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const dataPath = path.join(app.getPath('userData'), 'tasks.json');

const __filename = path.dirname(fileURLToPath(import.meta.url));
const __dirname = path.dirname(__filename);

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

function loadTasks() {
    const data = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(data);
}
app.whenReady().then(() => {

    checkDataFile();

    const list = loadTasks();
    console.log(list);

    createWindow();

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

})

