/*
* @Author: dm.yang
* @Date:   2014-12-17 17:51:48
* @Last Modified by:   chemdemo
* @Last Modified time: 2015-04-09 01:51:21
*/

'use strict';

var fs = require('fs');
var _ = require('lodash');
var log4js = require('log4js');

var conf = require('../conf');

var loggerConf = conf.logger;
var isDev = conf.isDev;

if(!fs.existsSync(loggerConf.root)) fs.mkdirSync(loggerConf.root);

log4js.configure(loggerConf.options, {
    cwd: loggerConf.root
});

Object.keys(loggerConf.options.levels).forEach(function(key) {
    var logger = log4js.getLogger(key);

    if(isDev) hook(key, logger);

    exports[key] = logger;
});

function hook(type, logger) {
    var methods = ['debug', 'info', 'warn', 'error'];

    _.each(methods, function(method) {
        var _method = logger[method];

        logger[method] = function() {
            // console has no `debug` method in Node.js
            console[method == 'debug' ? 'log' : method].apply(this, arguments);
            // _method();
        };
    });
};
