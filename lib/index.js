/*
 * finedlsorter
 * https://github.com/BrandonCravener/FineDLSorter
 *
 * Copyright (c) 2017 BrandonCravener
 * Licensed under the MIT license.
 */

'use strict';

const electron = require('electron');
const { app, BrowserWindow } = electron
const path = require('path')
const url = require('url')
const ipc = electron.ipcMain
const dialog = electron.dialog
const Menu = electron.Menu
const Tray = electron.Tray
const sorter = require('./sorter/sorter.js');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let appIcon = null
let windowCreated = false;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false
    })

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.normalize(`${__dirname}/../app/index.html`),
        protocol: 'file:',
        slashes: true
    }))
    windowCreated = true;
    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
    putInTray();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

app.on('before-quit', () => {
    appIcon.destroy();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipc.on('open-file-dialog', function(event) {
    dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory']
    }, function(files) {
        if (files) event.sender.send('selected-directory', files)
    })
})

function putInTray() {
    const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
    const iconPath = path.normalize(`${__dirname}/../${iconName}`)
    appIcon = new Tray(iconPath)
    const contextMenu = Menu.buildFromTemplate([{
        label: 'Exit',
        click: function() {
            app.quit();
        }
    }])
    appIcon.setToolTip('Download Sorter')
    appIcon.setContextMenu(contextMenu)
    appIcon.on('click', () => {
        if (!windowCreated) {
            createWindow();
        } else if (!win.isVisible()) {
            win.show();
        }
    })
}