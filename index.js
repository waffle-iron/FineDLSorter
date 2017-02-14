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
  // Check if the app is running in debug mode and if their is a message supplied
  if (config.debug && message) {
    // A message has been supplied and the app is in debug mode
    // Log the message given into the console
    console.log(message);
  }
}

// Check the given directory for folders if they dont exist create them
fs.readdirSync(config.directory, (err, files) => {
  // Check if their is an error provided
  if (err) {
    // An error message has been supplied
    // Log the error if in debug mode
    DebugLog(err);
  } else {
    // An error message hasen't been supplied
    // Itterate through the sorting categorys in the config
    for (let i = 0; i < Object.keys(config.sorting).length; i += 1) {
      // Define a variabel to hold the category name
      const folder = Object.keys(config.sorting)[i];
      // Check if the folder has a subdirectory for the category
      if (!files.includes(folder)) {
        // The directory doesn't contain a sub directory for the category
        // Create a new folder in the supplied download directory
        fs.mkdir(`${config.directory}/${folder}`, (error) => {
          // Attempt to log error to console if their is one
          DebugLog(error);
        });
      }
      // Check for the other folder in the download directory provided
      if (!files.includes(config.others_name)) {
        // Create a new directory in the supplied download directory
        fs.mkdir(`${config.directory}/${config.others_name}`, (error) => {
          // Attempt to log error to console if their is one
          DebugLog(error);
        });
      }
    }
  }
  // Log a message that all of the folders have been processed
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
