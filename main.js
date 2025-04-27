const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('jampal.html');

  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          click: async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog({
              properties: ['openFile'],
              filters: [{ name: 'Jampal Files', extensions: ['jpl'] }]
            });
            if (!canceled && filePaths.length > 0) {
              const filePath = filePaths[0];
              const fileContent = fs.readFileSync(filePath, 'utf-8');
              mainWindow.webContents.send('load-file', fileContent);
            }
          }
        },
        {
          label: 'Save As',
          click: async () => {
            const { canceled, filePath } = await dialog.showSaveDialog({
              filters: [{ name: 'Jampal Files', extensions: ['jpl'] }]
            });
            if (!canceled && filePath) {
              mainWindow.webContents.send('save-file', filePath);
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
