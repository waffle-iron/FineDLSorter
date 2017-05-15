/*
 * finedlsorter
 * https://github.com/BrandonCravener/FineDLSorter
 *
 * Copyright (c) 2017 BrandonCravener
 * Licensed under the MIT license.
 */

"use strict";

const pth = require("path");
const fs = require("fs");
const config = require("../config/handler.js");

/**
 * Get the folder to move the file to
 * @constructor
 * @param {string} path - Path of the file
 * @param {object} sortingConfig - The sorting rules
 */
exports.getNewLocation = (path, sortingConfig) => {
    let fileExt = pth.extname(path).toLowerCase(),
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
        if (config.readSetting("otherEnabled")) {
            return `${pth.dirname(path)}/${sortingConfig.others_name}/${pth.basename(path)}`;
        } else {
            return `${pth.dirname(path)}/${pth.basename(path)}`
        }
    }
};

/**
 * Get the folder to move the file to
 * @constructor
 * @param {object} sortingConfig - The sorting rules
 * @param {string} sortingDirectory - The sorting directory
 */
exports.createFolders = (sortingConfig, sortingDirectory) => {
    for (let i = 0; i < Object.keys(sortingConfig).length - 1; i += 1) {
        let name = Object.keys(sortingConfig)[i];
        fs.access(`${sortingDirectory}/${name}`, err => {
            if (err) {
                fs.mkdir(`${sortingDirectory}/${name}`);
            }
        });
    }
    let otherName = Object.entries(sortingConfig)[
        Object.keys(sortingConfig).length - 1
    ][1];
    fs.access(`${sortingDirectory}/${otherName}`, err => {
        if (err) {
            fs.mkdir(`${sortingDirectory}/${otherName}`);
        }
    });
};