VlabsMotionDetect
=================

This repository has to be splited in two parts :

* the `VlabsMotionDetect.ino` file aims to be downloaded into the Arduino controller
* the `RaspberryPi` folder has to be put on the Raspberry

Then on the Raspberry, you have to download the node modules :

    npm install

Change the `config.js` to you needs and have fun.

Then, run the server.

    node server.js
