/*jslint node: true */
"use strict";

var nodemailer = require('nodemailer');
var config = require('./config');

function VlabsMailer(emailSentCallback) {
    this.callback = emailSentCallback;
    this.transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth : {
            user: config.transportLogin,
            pass: config.transportPasswd
        }
    });
}

VlabsMailer.prototype = {
    sendMailWithFile: function(pathOfFile)
    {
        var mailOptions = {
            from: config.transportSender,
            to: config.transportDestination,
            subject: 'Intrusion detected !',
            text: 'Here is the picture taken :',
            attachments: [
                {
                    path: pathOfFile
                }
            ]
        }

        var that = this;
        this.transporter.sendMail(mailOptions, function(error, info) {
            if(error) {
                console.log(error);
            } else {
                console.log('Message sent: ' + info.response);
            }

            that.callback();
        });
    }
}

module.exports = VlabsMailer;