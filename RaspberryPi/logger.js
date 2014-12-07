/*jslint node: true */
"use strict";

var emitter = require('./event_emitter');

var logEvent = function logEvent(type, data) {
    if(data != '.') console.log(data);

    emitter.emit(type, data);
}

module.exports.logEvent = logEvent;