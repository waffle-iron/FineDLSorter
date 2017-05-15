/*
 * finedlsorter
 * https://github.com/BrandonCravener/FineDLSorter
 *
 * Copyright (c) 2017 BrandonCravener
 * Licensed under the MIT license.
 */

"use strict";

const async = require("async");
const config = require("../config/handler.js");
const fs = require("fs");
const sorter = require("./location.js");

let failedRetry;
let failed = [];
let sortingQueue = async.queue((options, callback) => {
    let newLocation = sorter.getNewLocation(options.path, options.sortingConfig);
    if (newLocation == options.path) {
        callback(null, null);
    } else {
        fs.rename(options.path, newLocation, err => {
            if (err) {
                callback(err, options.path);
            } else {
                callback(null, options.path);
            }
        });
    }
});

sorter.createFolders(
    config.readSetting("sortingConfig"),
    config.readSetting("sortingDirectory")
);

/**
 * Add a file to the queue to be sorted
 * @constructor
 * @param {string} pth - Path of the file
 */
exports.sort = pth => {
    sortingQueue.push({
            path: pth,
            sortingConfig: config.readSetting("sortingConfig")
        },
        (err, path) => {
            if (err) {
                if (err.code == "EBUSY") {
                    failed.push(path);
                } else {}
            }
        }
    );
};

/** Enable failed file sort retry */
exports.enableRetry = () => {
    failedRetry = setInterval(() => {
        async.each(failed, sort(pth));
    }, config.readSetting("failedRetryTime") * 60 * 1000);
};

/** Disable failed file sort retry */
exports.disableRetry = () => {
    clearInterval(failedRetry);
};