const { app, screen, BrowserWindow } = require('electron');

const createWindow = () => {

    const {width, height} = screen.getPrimaryDisplay().workAreaSize;

    const windowHeight = 500;
    const windowWidth = 300;

    const margin = 10;

    const win = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        x: width - windowWidth - margin,
        y: height - windowHeight - margin,
        frame: false,
        alwaysOnTop: true
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

})

