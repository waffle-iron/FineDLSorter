/*
 * finedlsorter
 * https://github.com/BrandonCravener/FineDLSorter
 *
 * Copyright (c) 2017 BrandonCravener
 * Licensed under the MIT license.
 */

'use strict';

const path = require('path');

let nconf = require('nconf').file({
    file: path.normalize(`${__dirname}/../../cfg/config.json`)
});


exports.saveSetting = (settingKey, settingValue) => {
    nconf.set(settingKey, settingValue);
    nconf.save();
};

exports.readSetting = (settingKey) => {
    nconf.load();
    return nconf.get(settingKey);
};