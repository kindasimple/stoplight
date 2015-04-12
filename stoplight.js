'use strict';
/*
 * stoplight.js
 * Send HTTP commands to control the lights of a stoplight. The
 * controller toggles between the green and red lights, while the yellow
 * light turns on and off independently. There is a option to flash the yellow 
 * light to indicate a busy status.
 */

var http = require('http')

/**
 * Sends commands over HTTP to control a Xytronics relay switch
 * connected to a stoplight
 * @constructor
 * @param {string} host - the host for the switch on the network
 */
var Stoplight = function (host) {
    this.host = host || 'http://192.168.0.15'
    this.path = 'stateFull.xml'
}

/**
 * Sends a command to directly flip a particular relay to a desired state
 * @param {int} relay - the relay to control (1,2)
 * @param {int} state - the state to set (0: off, 1: on, 2: pulse)
 */
Stoplight.prototype.changeRelayState = function (relay, state) {
    var path = this.path + "?relay" + relay + "State=" + state
    console.log(path)
    //open connection to path
    http.get({
		path: path,
		host: this.host }
	    , function (res) {
		checkStatus(res.statusCode)
	})
	.on('error', function (err) {
	    console.log("Could not update relay. " + err.message)
	})

}

/**
 * Turn on the red light, and the green light off
 */
Stoplight.prototype.goRed = function () {
    this.changeRelayState(1,1) 
}
/**
 * Turn on the green light, and turn the red light off
 */
Stoplight.prototype.goGreen = function () {
    this.changeRelayState(1,0)
}
/**
 * Turn on the yellow light
 */
Stoplight.prototype.goYellow = function () {
    this.changeRelayState(2, 1)
}
/**
 * Turn off the yellow light
 */
Stoplight.prototype.noYellow = function () {
    this.changeRelayState(2,0)
}
Stoplight.prototype.reset = function () {
    this.noYellow()
    this.goGreen()
}

Stoplight.prototype.test = function () { 
    this.reset()
    setTimeout(this.goYellow.bind(this), 1000)
    setTimeout(this.goRed.bind(this), 2000)
    setTimeout(this.noYellow.bind(this), 3000)
}

Stoplight.prototype.startFlashYellow = function (interval, duration) {
    var timestamp = new Date().addSeconds(duration).getTime(),
	nextChange,
	state = false
    do {
	if(!state) {
	    this.goYellow()
	} else {
	    this.noYellow()
	}
	sleep(interval)
    } while((!duration && !this.flashReset) || new Date().getTime() < timestamp)
    this.flashReset = null
}

Stoplight.prototype.stopFlashYellow = function () {
    this.flashReset = true
}

module.exports = Stoplight
