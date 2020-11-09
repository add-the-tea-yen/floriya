const { BrowserWindow, app, screen } = require('electron')
require('./server.js')

let mainWindow = null

function main() {
  mainWindow = new BrowserWindow({icon: __dirname + '/favicon.ico'})
  mainWindow.loadURL(`http://localhost:3000/`,{userAgent: 'Chrome'})
  mainWindow.setMenuBarVisibility(false)
  mainWindow.maximize()
  mainWindow.on('close', event => {
    mainWindow = null
  })
}

app.on('ready', main)