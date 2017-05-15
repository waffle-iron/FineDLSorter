/*
 * finedlsorter
 * https://github.com/BrandonCravener/FineDLSorter
 *
 * Copyright (c) 2017 BrandonCravener
 * Licensed under the MIT license.
 */

/* 
 * Requires
 */
const config = require("../lib/config/handler.js");
const ipc = require("electron").ipcRenderer;
const url = require("url");
const remote = require("electron").remote;
const path = require("path");
const os = require("os");
const watcher = require("../lib/watcher/directoryWatcher.js");

/*
 * Variables
 */
let win = remote.getCurrentWindow();

/*
 * Page code
 */
function updateIgnoredList() {
    $("#table__sorting-configurations").empty();
    let ignoredFiles = config.readSetting("ignoredFiles");
    for (let i = 0; i < ignoredFiles.length; i += 1) {
        $("#table__sorting-configurations").append(
            '<tr class="item__ignored-file hoverable"><td>' +
            ignoredFiles[i] +
            "</td></tr>"
        );
    }
    $(".item__ignored-file").click(function() {
        let ignFiles = config.readSetting("ignoredFiles");
        ignFiles.splice(ignFiles.indexOf($(this).text()), 1);
        config.saveSetting("ignoredFiles", ignFiles);
        $(this).remove();
    });
}
let sortingStatusText = config.readSetting("enableSorting") ? "Active" : "Idle";
$("#text__sorting-status").text(sortingStatusText);
if (config.readSetting("enableSorting")) {
    watcher.enableWatching();
    $("#switch__sorting-enable").attr("checked", true);
}

/* 
 * Window size controllers
 */
win.on("maximize", () => {
    $(".button__maximize-window").hide();
    $(".button__restore-window").show();
});

win.on("unmaximize", () => {
    $(".button__restore-window").hide();
    $(".button__maximize-window").show();
});

/*
 * Other code
 */
ipc.on("selected-directory", function(event, path) {
    $(".text__sorting-directory").text(path);
    config.saveSetting("sortingDirectory", path);
    watcher.disableWatching();
    watcher.enableWatching();
});

$(document).ready(() => {
    if (config.readSetting("sortingDirectory").length == 0) {
        config.saveSetting(
            "sortingDirectory",
            path.join(os.homedir(), "downloads")
        );
    } else {
        $(".text__sorting-directory").text(config.readSetting("sortingDirectory"));
    }
    $("#text__sorting-categorys").text(
        Object.entries(config.readSetting("sortingConfig")).length
    );
    $("#num__ignored-files").text(watcher.getIgnoredCount());
    $("#button__go-to-categories").click(() => {
        $("#page__home").fadeOut(() => {
            $("#page__configurations").fadeIn();
        });
    });
    // Minimize window button
    $("#button__minimize-window").click(function() {
        win.minimize();
    });
    // Maximize window button
    $(".button__maximize-window").click(function() {
        win.maximize();
        $(this).hide();
        $(".button__restore-window").show();
    });
    // Restore window button
    $(".button__restore-window").click(function() {
        win.restore();
        $(this).hide();
        $(".button__maximize-window").show();
    });

    $("#button__select-download-dir").click(function() {
        ipc.send("open-file-dialog");
    });

    $("#button__go-to-ignored").click(() => {
        updateIgnoredList();
        $("#page__home").fadeOut(() => {
            $("#page__ignored").fadeIn();
        });
    });

    $(".button__back").click(() => {
        $("#page__ignored").fadeOut(() => {
            $("#page__home").fadeIn();
        });
        $("#num__ignored-files").text(watcher.getIgnoredCount());
    });
    $(".button__back-categories").click(() => {
        $("#page__configurations").fadeOut(() => {
            $("#page__home").fadeIn();
        });
    });

    $("#switch__sorting-enable").change(() => {
        if ($("#switch__sorting-enable").prop("checked")) {
            watcher.enableWatching();
            config.saveSetting("enableSorting", true);
        } else {
            watcher.disableWatching();
            config.saveSetting("enableSorting", false);
        }
        let sortingStatusText = config.readSetting("enableSorting") ?
            "Active" :
            "Idle";
        $("#text__sorting-status").text(sortingStatusText);
    });

    $("#button__add-new-ignored-rule").click(() => {
        let ignFiles = config.readSetting("ignoredFiles");
        ignFiles.push($("#text__new-ignored-rule").val());
        config.saveSetting("ignoredFiles", ignFiles);
        $("#text__new-ignored-rule").val("");
        updateIgnoredList();
        watcher.disableWatching();
        watcher.enableWatching();
    });
});