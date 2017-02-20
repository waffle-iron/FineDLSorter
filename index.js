// Requires
const config = require('config-node')({
  dir: `${__dirname}/config`,
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
// Itterate through the list of ignored files
for (let i = 0; i < config.ignore.length; i += 1) {
  // Push the file to the array
  ignoredFiles.push(`${config.directory}/${config.ignore[i]}`);
}

// Define the download folder watcher to detect file system changes
const watcher = chokidar.watch(config.directory, {
  ignored: ignoredFiles, // Ignore the files supplied
  persistent: true, // Keep the process running while the files are being watched
  depth: 0, // Dont watch subdirectories of the the download folder 
});

// Wait for new files to be added to the download folder
watcher.on('add', (path) => {
  // If debug then log the file that has been added
  DebugLog(`Directory ${path} has been added`);
  // Get the file extension of the file added
  const fileExt = pth.extname(path);
  // If debug log the file extension
  DebugLog(fileExt);
  // Define a variable to keep track of the sorting state
  let sorted = false;
  // Itterate through all of the sorting categorys
  for (let i = 0; i < Object.keys(config.sorting).length; i += 1) {
    // Create a variable to contain the category name
    const folder = Object.keys(config.sorting)[i];
    // If debug log the category name to the console
    DebugLog(folder);
    // Check if the category holds the extension of the new file
    if (config.sorting[folder].includes(fileExt)) {
      // The category does contain the file extension
      // Create a timer to delay moving the file
      setTimeout(() => {
        // If debug log where the file will be moved from and where to
        DebugLog(`Moving ${path} to ${pth.dirname(path)}/${folder}/${pth.basename(path)}`);
        // Move the file to the folder for the category matched
        mv(path, `${pth.dirname(path)}/${folder}/${pth.basename(path)}`, (err) => {
          // If their is and error and it is in debug mode log the error
          DebugLog(err);
        });
      }, config.delay * 1000); // Calculate the delay of the file move and set it
      // Update the sorting status variable so the app knows the files sorted
      sorted = true;
      // Stop the for loop early
      break;
    }
  }
  // Test if the file is not sorted
  if (!sorted) {
    // The file is not sorted
    // Create a timer to delay moving the file
    setTimeout(() => {
      // Log that the file will be moved to the other folder if its in debug mode
      DebugLog(`Moving ${path} to ${pth.dirname(path)}/${config.others_name}/${pth.basename(path)}`);
      // Move the file to the other folder
      mv(path, `${pth.dirname(path)}/${config.others_name}/${pth.basename(path)}`, (err) => {
        // Log the error if their is one in debug mode
        DebugLog(err);
      });
    }, config.delay * 1000); // Calculate the delay of the file move and set it
  }
});
