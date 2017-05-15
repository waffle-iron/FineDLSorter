/*
 * finedlsorter
 * https://github.com/BrandonCravener/FineDLSorter
 *
 * Copyright (c) 2017 BrandonCravener
 * Licensed under the MIT license.
 */

"use strict";
const chokidar = require("chokidar");
const config = require("../config/handler.js");
const sorter = require("../sorter/sorter.js");
const ignoredBuilder = require("./ignoredBuilder.js");

let watcher;

/** Enable file watching in the config directory */
exports.enableWatching = () => {
    watcher = chokidar.watch(config.readSetting("sortingDirectory"), {
        ignored: ignoredBuilder.getIgnored(config.readSetting("sortingDirectory")),
        persistent: true,
        depth: 0
    });
    watcher.on("add", path => {
        sorter.sort(path);
        console.log(path);
    });
};

/** Disable file watching in the config directory */
exports.disableWatching = () => {
    watcher.close();
    watcher = null;
};

/** Get the ammount of ignored files */
exports.getIgnoredCount = () => {
    return ignoredBuilder.getIgnored(config.readSetting("sortingDirectory"))
        .length;
};