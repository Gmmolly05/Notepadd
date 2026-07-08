import { app, screen, dialog, ipcMain, BrowserWindow } from 'electron';
import electronUpdater from 'electron-updater';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { loadTasks, saveTasks } from './src/storage/tasks.js';

const { autoUpdater } = electronUpdater;

const dataPath = path.join(app.getPath('userData'), 'tasks.json');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

ipcMain.handle('get-tasks', () => loadTasks(dataPath));
ipcMain.handle('set-tasks', (event, tasks) => saveTasks(dataPath, tasks));
ipcMain.handle('minimize-window', () => BrowserWindow.getFocusedWindow().minimize());
ipcMain.handle('close-window', () => BrowserWindow.getFocusedWindow().close());

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
}

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

function checkForUpdates() {
    autoUpdater.on('checking-for-update', () => {
        dialog.showMessageBoxSync({
            message: 'Checking for update...'
        });
    });

    autoUpdater.on('update-available', (info) => {
        dialog.showMessageBoxSync({
            message: `Update available: ${info.version}`
        });
    });

    autoUpdater.on('update-not-available', (info) => {
        dialog.showMessageBoxSync({
            message: `No update available. Current: ${app.getVersion()}`
        });
    });

    autoUpdater.on('download-progress', (progress) => {
        console.log(`Download ${progress.percent}%`);
    });

    autoUpdater.on('update-downloaded', (info) => {
        dialog.showMessageBoxSync({
            message: `Downloaded update: ${info.version}`
        });
    });

    autoUpdater.on('error', (error) => {
        dialog.showErrorBox(
            'Updater Error',
            error == null ? 'unknown error' : error.toString()
        );
    });

    if (app.isPackaged) {
        autoUpdater.checkForUpdatesAndNotify();
    } else {
        dialog.showMessageBoxSync({
            message: 'App is not packaged'
        });
    }
}

app.whenReady().then(() => {

    app.setLoginItemSettings(
        {
            openAtLogin: true
        }
    );

    checkDataFile();

    createWindow();

    checkForUpdates();

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

})

