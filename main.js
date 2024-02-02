const { app, BrowserWindow, autoUpdater } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    });
  
    win.loadFile('index.html');
  }
  
  app.whenReady().then(() => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify(); // Esta línea agregada para comprobar actualizaciones al iniciar
  });
  