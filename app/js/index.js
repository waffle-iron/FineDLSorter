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
const config = require('../lib/config/handler.js');
const ipc = require('electron').ipcRenderer;
const url = require('url');
const remote = require('electron').remote;

/*
 * Variables
 */
let win = remote.getCurrentWindow();


/*
 * Page code
 */
$(document).ready(() => {
    let sortingStatusText = config.readSetting('enableSorting') ? 'Active' : 'Idle';
    $('#text__sorting-status').text(sortingStatusText);
    if (config.readSetting('enableSorting')) {
        $('#switch__sorting-enable').attr('checked', true);
    }

    $('#button__minimize-window').click(function() {
        win.minimize();
    });

    $('#button__maximize-window').click(function() {
        win.maximize();
        $(this).hide();
        $('#button__restore-window').show();
    });

    $('#button__restore-window').click(function() {
        win.restore();
        $(this).hide();
        $('#button__maximize-window').show();
    });

    $('#button__select-download-dir').click(function() {
        ipc.send('open-file-dialog');
    });
});
$('#button__go-to-ignored').click(() => {
    $('#page__home').fadeOut(() => {
        $('#page__ignored').fadeIn();
    });
});
$('.button__back').click(() => {
    $('#page__ignored').fadeOut(() => {
        $('#page__home').fadeIn();
    });
});

/* 
 * Window size controllers
 */
win.on('maximize', () => {
    $('#button__maximize-window').hide();
    $('#button__restore-window').show();
});

win.on('unmaximize', () => {
    $('#button__restore-window').hide();
    $('#button__maximize-window').show();
});


/*
 * Other code
 */
ipc.on('selected-directory', function(event, path) {
    $('.text__sorting-directory').text(path);
})