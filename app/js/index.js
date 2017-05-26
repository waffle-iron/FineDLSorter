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
            '<tr class="item__ignored-file"><td>' + ignoredFiles[i] + "</td></tr>"
        );
    }
    $(".item__ignored-file").click(function() {
        let ignFiles = config.readSetting("ignoredFiles");
        ignFiles.splice(ignFiles.indexOf($(this).text()), 1);
        config.saveSetting("ignoredFiles", ignFiles);
        $(this).remove();
    });
}
window.categories = config.readSetting("sortingConfig");

function loadSortingCategories() {
    $("#table__sorting-config").empty();
    let categories = config.readSetting("sortingConfig");
    let entries = Object.entries(categories);
    for (let i = 0; i < entries.length - 1; i++) {
        let entry = entries[i];
        let extensions = [];
        for (let x = 0; x < entry[1].length; x++) {
            extensions.push({
                tag: entry[1][x]
            });
        }
        $("#table__sorting-config").append(
            `<tr>
                 <td>${entry[0]}</td>
                 <td>
                     <div class="chips ${entry[0]}-initial"></div>
                 </td>
             </tr>`
        );
        $(`.${entry[0]}-initial`).material_chip({
            data: extensions
        });
        $(`.${entry[0]}-initial`).on("chip.delete", function(e, chip) {
            let category = categories[entry[0]];
            category.splice(category.indexOf(chip.tag), 1);
            config.saveSetting("sortingConfig", categories);
        });
        $(`.${entry[0]}-initial`).on("chip.add", function(e, chip) {
            let category = categories[entry[0]];
            category.push(chip.tag);
            config.saveSetting("sortingConfig", categories);
        });
    }
}

if (config.readSetting("enableSorting")) {
    watcher.enableWatching();
    $("#switch__sorting-enable").attr("checked", true);
}
if (config.readSetting("otherEnabled")) {
    $("#switch__other-enable").attr("checked", true);
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
    loadSortingCategories();
    $("#text__sorting-status").text(
        config.readSetting("enableSorting") ? "Active" : "Idle"
    );
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
    $("#button__close-window").click(function() {
        win.close();
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
    $("#switch__other-enable").change(() => {
        if ($("#switch__other-enable").prop("checked")) {
            config.saveSetting("otherEnabled", true);
        } else {
            config.saveSetting("otherEnabled", false);
        }
    });
    $("#button__exit").click(() => {
        ipc.send("exit");
    });
    $("#searchbar__sorting-categories").change(() => {
        if ($.trim($("#searchbar__sorting-categories").val()) == 0) {
            $("#table__sorting-config tr").fadeIn();
        } else {
            $(
                "#table__sorting-config tr:not(:has(.ext_chip:contains(" +
                $.trim($("#searchbar__sorting-categories").val()) +
                ")))"
            ).fadeOut();
        }
    });
    $("#searchbar__ignored-rules").change(() => {
        if ($.trim($("#searchbar__ignored-rules").val()) == 0) {
            $("#table__sorting-configurations tr").fadeIn();
        } else {
            $(
                "#table__sorting-configurations tr:not(:has(td:contains(" +
                $.trim($("#searchbar__ignored-rules").val()) +
                ")))"
            ).fadeOut();
        }
    });
});