/*
 * finedlsorter
 * https://github.com/BrandonCravener/FineDLSorter
 *
 * Copyright (c) 2017 BrandonCravener
 * Licensed under the MIT license.
 */

'use strict';


const winston = require('winston');

// Configure the logging system
winston.configure({
    transports: [
        new(winston.transports.File)({ filename: `${__dirname}/current.log` })
    ]
});

/**
 * Handles errors in the app
 * @constructor
 * @param {any} err - The error
 * @param {number} type - The type of error
 */
exports = (err, type) => {
    if (err) {
        switch (type) {
            default: winston.error(err);
            break;
        }
    } else {
        return new SyntaxError('Please include a valid error!');
    }
}