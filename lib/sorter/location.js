/*
 * finedlsorter
 * https://github.com/BrandonCravener/FineDLSorter
 *
 * Copyright (c) 2017 BrandonCravener
 * Licensed under the MIT license.
 */

'use strict';

const pth = require('path');

/**
 * Get the folder to move the file to
 * @constructor
 * @param {string} path - Path of the file
 * @param {object} sortingConfig - The sorting rules
 */
exports.getNewLocation = (path, sortingConfig) => {
    console.log(sortingConfig);
    let fileExt = pth.extname(path),
        complete = false;
    for (let i = 0; i < Object.keys(sortingConfig).length; i += 1) {
        const folder = Object.keys(sortingConfig)[i];
        if (sortingConfig[folder].includes(fileExt)) {
            complete = true;
            return `${pth.dirname(path)}/${folder}/${pth.basename(path)}`;
            break;
        }
    }
    if (!complete) {
        return `${pth.dirname(path)}/${sortingConfig.others_name}/${pth.basename(path)}`;
    }
}