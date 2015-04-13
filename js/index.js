'use strict';

/* a REST API for signaling critical alerts */

var restify = require('restify'),
    http = require('http'),
    relayHost = '192.168.0.15',
    Stoplight = require('./stoplight'),
    stoplight = new Stoplight(relayHost),
    log4js = require('log4js'),
    log = new log4js.getLogger("notifications"),
    server = restify.createServer({
	name: 'stoplight',
	version: '0.9.0'
    }),
    relayPath = '/stateFull.xml'

server.use(restify.bodyParser())

server.get('/busy/:state/', function (req, res) {
    if(req.params.state === 'true') {
	stoplight.busy()
	    .then(function () {
		res.json(200, stoplight.toJSON())
	    })
	    .fail(function () {
		res.json(500, stoplight.toJSON())
	    })
    } else {
	stoplight.ready()
	    .then(function () {
		res.json(200, stoplight.toJSON())
	    })
	    .fail(function () {
		res.json(500, stoplight.toJSON())
	    })
    }
})

server.get('/ok', function (req, res) {
    stoplight.green()
	.then(function () {
	    res.json(200, stoplight.toJSON())
	})
	.fail(function () {
	    res.json(500, stoplight.toJSON())
	})
})

server.post('/ok', function (req, res) {
    stoplight.green()
	.then(function () {
	    res.json(200, stoplight.toJSON())
	})
	.fail(function () {
	    res.json(500, stoplight.toJSON())
	})
    //user body parser to process payload
    req.body
})

server.get('/error', function () {
    stoplight.red()
	.then(function () {
	    res.json(200, stoplight.toJSON())
	})
	.fail(function () {
	    res.json(500, stoplight.toJSON())
	})
})

// add custom endpoints here
require('./jenkins')(server, stoplight)

server.listen(8111, function () {
    log.info('%s listening at %s', server.name, server.url)
    stoplight.test().then(function() {
	stoplight.reset()
    })

    //query web service for state()
})
