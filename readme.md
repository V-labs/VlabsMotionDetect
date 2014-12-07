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


## Some tips about port 80

If you want to use port 80, you have to make a redirection with your firewall. For exemple, make the web server listen on port 3000
and then route all the traffic from 80 to 3000 with this command :

    sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000

To see nat rules :

    sudo iptables -t nat -L

To remove one of you nat rule :

    sudo iptables -t nat -D PREROUTING <line_index>
