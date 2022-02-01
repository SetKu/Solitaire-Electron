const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const window = new BrowserWindow({
    width: 1200,
    height: 900
  });

  window.loadFile(path.join(__dirname, 'public/index.html'));

  //Open Chromium dev tools
  //window.webContents.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
})