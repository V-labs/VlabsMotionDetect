/*jslint node: true */
"use strict";

require('./web_server');

var com = require("serialport");
var Stream = require('./serial_stream');
var Mailer = require('./mailer');
var Logguer = require('./logger');

var emitter = require('./event_emitter');

(function app() {

    var serialPort = new com.SerialPort("/dev/ttyACM0", {
        baudrate: 115200,
        parser: com.parsers.readline('\r\n')
    }, false);

    var stream = null;
    var mailer = null;

    serialPort.open(function (error) {
        if ( error ) {
            console.log('Failed to open: '+error);
        } else {
            console.log('Connection established');

            serialPort.on('data', function(data)
            {
                if(!Buffer.isBuffer(data)) {

                    if(stream == null) {
                        stream = new Stream(resetParser);
                    }

                    if(mailer == null) {
                        mailer = new Mailer(restartCamera);
                    }

                    Logguer.logEvent('console', data);

                    if(stream.isBeginOfFile(data)) {
                        Logguer.logEvent('console', 'Switch parser');
                        serialPort.options.parser = com.parsers.raw;
                    }

                } else {
                    process.stdout.write(".");
                    Logguer.logEvent('console', '.');
                    if(stream.isEndOfFile(data)) {
                        var path = stream.getFilePath();
                        stream.finish();
                        mailer.sendMailWithFile(path);
                        emitter.emit('newFile', path);
                    } else {
                        stream.write(data)
                    }
                };
            });
        }
    });

    function resetParser() {
        serialPort.options.parser = com.parsers.readline('\r\n');
        console.log('');
        Logguer.logEvent('console', 'Writed : '+ stream.receivedBytes +' bytes');

        setTimeout(function() {
            stream = null;
        }, 500, stream);
    };

    function restartCamera() {
        Logguer.logEvent('console', 'Restart camera');

        // end of transfer
        serialPort.write('\n');
    }

})();