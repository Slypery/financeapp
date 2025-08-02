// try {
//     require('electron-reloader')(module);
// } catch (_) {}
process.env.NODE_ENV = process.env.NODE_ENV ?? 'development';
global.sharedData = {};
const { app, BrowserWindow } = require('electron/main');
const path = require('node:path');

let win;
const createWindow = () => {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'ipc/preload.js'),
        }
    });
    win.setMenuBarVisibility(false);

    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173');
    } else {
        win.loadFile(path.join(__dirname, 'renderer', 'dist', 'index.html'));
    }

}

app.whenReady().then(() => {
    require('./ipc/handlersAutoload');
    createWindow();

    if (process.env.NODE_ENV === 'development') {
        const chokidar = require('chokidar');
        let reloadTimeout;
        chokidar.watch(path.join(__dirname, 'ipc/preload.js')).on('change', () => {
            clearTimeout(reloadTimeout);
            reloadTimeout = setTimeout(() => {
                console.log('[main] Detected change in preload.js. Reloading window...');
                if (win && !win.isDestroyed()) {
                    win.webContents.reload();
                }
            }, 300);
        });
    }

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});