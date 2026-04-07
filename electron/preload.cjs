const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectFiles: () => ipcRenderer.invoke('select-files'),
  readFolder: (folderPath) => ipcRenderer.invoke('read-folder', folderPath),
  readPdfFile: (filePath) => ipcRenderer.invoke('read-pdf-file', filePath),
  saveFile: (opts) => ipcRenderer.invoke('save-file', opts),
  isElectron: true,
});
