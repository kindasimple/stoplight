/*
 * stoplight.js
 * Send HTTP commands to control the lights of a stoplight. The
 * controller toggles between the green and red lights, while the yellow
 * light turns on and off independently. There is a option to flash the yellow 
 * light to indicate a busy status.
 */

var http = require('http'),
    parseString = require('xml2js').parseString,
    Q = require('q')

/**
 * Sends commands over HTTP to control a Xytronics relay switch
 * connected to a stoplight
 * @constructor
 * @param {string} host - the host for the switch on the network
 */
var Stoplight = function (host) {
    this.host = host || '192.168.0.15'
    this.path = '/stateFull.xml'
    this.isGreen = null
    this.isYellow = null
    this.isRed = null
    this.isPending = null
}


Stoplight.prototype.print = function () {
    console.log("Green: " + this.isGreen)
    console.log("Yellow: " + this.isYellow)
    console.log("Red: " + this.isRed)
    console.log("isPending: " + this.isPending)
}

Stoplight.prototype.toJSON = function () {
    return {
	green: this.isGreen,
	yellow: this.isYellow,
	red: this.isRed,
	pending: this.isPending
    }
}
/**
 * Update the controller state to reflect that of the physical switch
 * @parameter {string} result - an xml response from the controller
 */
Stoplight.prototype.processResponse = function (result) {
    console.log("processing response")
    //console.log(result)
    parseString(result, function (err, result) {
	//console.log(result)
	this.isGreen = Number(result.datavalues.relay1state.pop()) === 0
	this.isRed = !this.isGreen
	this.isYellow = Number(result.datavalues.relay2state.pop()) === 1
	this.print()
    }.bind(this))
}

/**
 * Sends a command to directly flip a particular relay to a desired state
 * @param {int} relay - the relay to control (1,2)
 * @param {int} state - the state to set (0: off, 1: on, 2: pulse)
 */
Stoplight.prototype.changeRelayState = function (relay, state) {
    var path = this.path + "?relay" + relay + "State=" + state,
	options = {
	    path: path,
	    host: this.host,
	    reponseType: 'text'
	}
    console.log(path)

    var deferred = Q.defer()
    var callback = function (res) {
	switch(res.statusCode) {
	    case 200:
	    default:
		console.log("got response")
		var body = ''
		res.on('data', function (result) {
		    console.log("some data")
		    body += result
		})
		
		res.on('end', function () {
		    console.log("end")
		  this.processResponse(body)
		  deferred.resolve(this.toJSON())
		}.bind(this))
		break
//	    default:
//		console.log("error")
//		deferred.reject(res.statusCode)
//		break
	}
    }.bind(this)

    console.log("Making request")
    //open connection to path
    http.get(options, callback)
    .on('error', function(err) {
	console.log("sad error")
	console.log(err)
	deferred.reject(err)
    })

    return deferred.promise
}

/**
 * Turn on the red light, and the green light off
 */
Stoplight.prototype.red = function () {
    return this.changeRelayState(1,1) 
}
/**
 * Turn on the green light, and turn the red light off
 */
Stoplight.prototype.green = function () {
    return this.changeRelayState(1,0)
}
/**
 * Turn on the yellow light
 */
Stoplight.prototype.busy = function () {
    return this.changeRelayState(2, 1)
}
/**
 * Turn off the yellow light
 */
Stoplight.prototype.ready = function () {
    console.log("readying")
    return this.changeRelayState(2,0)
}

/**
 * turn off the yellow busy indicator and turn on green light
 */
Stoplight.prototype.reset = function () {
    console.log("resetting")
    return Q.all([
	    this.ready(),
	    this.green()
	    ])
}

Stoplight.prototype.test = function () { 
    this.reset()
    setTimeout(this.busy.bind(this), 1000)
    setTimeout(this.red.bind(this), 2000)
    var deferred = Q.defer()
    setTimeout(function () { 
	this.ready() 
	.fin(deferred.resolve)
    }.bind(this), 3000)
    return deferred.promise
}

var flip = function () {
    if(this.isYellow) {
	this.ready()
    } else {
	this.busy()
    }
}

var flash = function (action, interval, duration) {
    var timeout = new Date(Date.now() + duration).getTime()
    return function () {
	this.isPending = setInterval(function () { 
	    var timestamp = new Date().getTime()
	     if(!duration || timestamp < timeout /*we are still going*/) {
		action()
	     } else {
		 this.resolved()
	     }
	 }.bind(this), interval)
    }
}
Stoplight.prototype.pending = function (interval, duration) {
    var flashBusy = flash(flip.bind(this), interval, duration ).bind(this)
    flashBusy()
}

Stoplight.prototype.resolved = function () {
    clearTimeout(this.isPending)
    return this.ready()
}

module.exports = Stoplight
