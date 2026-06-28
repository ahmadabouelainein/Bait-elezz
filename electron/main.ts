import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'node:path'
import { setupClaudeIPC } from './claude-ipc'

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const isDev = !!VITE_DEV_SERVER_URL

function setupAutoUpdater(win: BrowserWindow) {
  if (isDev) return
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { autoUpdater } = require('electron-updater')
  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('update-available', () => {
    win.webContents.send('update:available')
  })

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(win, {
      type: 'info',
      title: 'Update Ready',
      message: 'A new version has been downloaded. It will be installed when you quit the app.',
      buttons: ['Install Now', 'Later'],
    }).then(({ response }) => {
      if (response === 0) autoUpdater.quitAndInstall()
    })
  })

  ipcMain.handle('updater:check', () => autoUpdater.checkForUpdates())

  autoUpdater.checkForUpdatesAndNotify().catch(() => {/* network may be offline */})
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    icon: path.join(__dirname, '../public/icon.png'),
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  setupClaudeIPC(ipcMain)
  setupAutoUpdater(win)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
