"use strict";
// Requires
const config = require('config-node')({
  dir: 'config',
  ext: 'json',
  env: 'production',
});
const chokidar = require('chokidar');
const pth = require('path');
const fs = require('fs');
const mv = require('mv');

// Setup function for checking debug mode before logging debug
function DebugLog(message) {
  if (config.debug && message) {
    console.log(message);
  }
}

// Check the given directory for folders if they dont exist create them
fs.readdirSync(config.directory, (err, files) => {
  if (err) {
    DebugLog(err);
  } else {
    for (let i = 0; i < Object.keys(config.sorting).length; i += 1) {
      const folder = Object.keys(config.sorting)[i];
      if (!files.includes(folder)) {
        fs.mkdir(`${config.directory}/${folder}`, (error) => {
          DebugLog(error);
        });
      }
      if (!files.includes(config.others_name)) {
        fs.mkdir(`${config.directory}/${config.others_name}`, (error) => {
          DebugLog(error);
        });
      }
    }
  }
  DebugLog('Folders have been processed');
});

// Create an array to contain the file path of ignored files
const ignoredFiles = [];
for (let i = 0; i < config.ignore.length; i += 1) {
  ignoredFiles.push(`${config.directory}/${config.ignore[i]}`);
}

// Define the download folder watcher to detect file system changes
const watcher = chokidar.watch(config.directory, {
  ignored: ignoredFiles,
  persistent: true,
  depth: 0,
});

watcher.on('add', (path) => {
  DebugLog(`Directory ${path} has been added`);
  const fileExt = pth.extname(path);
  DebugLog(fileExt);
  let sorted = false;
  for (let i = 0; i < Object.keys(config.sorting).length; i += 1) {
    const folder = Object.keys(config.sorting)[i];
    DebugLog(folder);
    if (config.sorting[folder].includes(fileExt)) {
      setTimeout(() => {
        DebugLog(`Moving ${path} to ${pth.dirname(path)}/${folder}/${pth.basename(path)}`);
        mv(path, `${pth.dirname(path)}/${folder}/${pth.basename(path)}`, (err) => {
          DebugLog(err);
        });
      }, config.delay * 1000);
      sorted = true;
      break;
    }
  }
  if (!sorted) {
    setTimeout(() => {
      DebugLog(`Moving ${path} to ${pth.dirname(path)}/${config.others_name}/${pth.basename(path)}`);
      mv(path, `${pth.dirname(path)}/${config.others_name}/${pth.basename(path)}`, (err) => {
        DebugLog(err);
      });
    }, config.delay * 1000);
  }
});
