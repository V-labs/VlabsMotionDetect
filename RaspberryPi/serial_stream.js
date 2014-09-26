/*jslint node: true */
"use strict";

var fs = require('fs');

function SerialStream(finishCallback, userOptions) {
    this.filePath = 'images/picture' + Date.now() + '.jpg';
    this.stream = fs.createWriteStream(this.filePath);
    this.previousBufferData = ''
    this.lastTwoDatas = '';
    this.receivedBytes = 0;
    this.eomIndex = -1;

    this._options = {
        startMarker : "BOF",
        endMarker : "EOF"
    }

    if(typeof finishCallback != "function") {
        console.error("Finish callback must be a function");
    }

    this.options = userOptions || this._options;

    this.stream.on('finish', finishCallback);
    this.stream.on('error', function(err) {
        console.log('error : ' + err);
    });
}

SerialStream.prototype = {
    isBeginOfFile: function(data) {
        if(data.toString() == this.options.startMarker) {
            return true;
        }

        return false;
    },

    isEndOfFile: function(data) {
        this.lastTwoDatas = this.previousBufferData+data;
        this.eomIndex = this.lastTwoDatas.indexOf(this.options.endMarker);

        if(this.eomIndex > -1 && this.receivedBytes > 3000) {
            return true;
        }

        return false;
    },

    write: function(data) {
        this.stream.write(data);
        this.previousBufferData = data;
        this.receivedBytes += data.length;
    },

    finish: function() {
        this.stream.end(this.lastTwoDatas.slice(0, this.eomIndex));
    },

    getFilePath: function() {
        return this.filePath;
    }
};

module.exports = SerialStream;