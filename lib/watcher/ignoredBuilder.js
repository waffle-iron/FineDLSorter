/*
 * finedlsorter
 * https://github.com/BrandonCravener/FineDLSorter
 *
 * Copyright (c) 2017 BrandonCravener
 * Licensed under the MIT license.
 */

'use strict';

const config = require('../config/handler.js');

/**
 * Get an array of files to be ignored
 * @constructor
 * @param {string} dir - Directory to be sorted
 * @returns {array}
 */
exports.getIgnored = (dir) => {
    let ignore = config.readSetting('ignoredFiles');
    const ignoredFiles = [];
    for (let i = 0; i < ignore.length; i += 1) {
        ignoredFiles.push(`${dir}/${ignore[i]}`);
    }
    return ignoredFiles;
};