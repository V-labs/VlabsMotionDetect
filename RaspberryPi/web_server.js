/*jslint node: true */
"use strict";

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var emitter = require('./event_emitter');

app.use(express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
    emitter.on('console', function(data) {
       socket.emit('console', data);
    });

    emitter.on('newFile', function(data) {
       socket.emit('newFile', data.replace('public/', ''));
    });
});

server.listen(3000);
