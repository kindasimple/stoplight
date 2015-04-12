'use strict';

/* a REST API for signaling critical alerts */

var restify = require('restify'),
    http = require('http'),
    relayHost = 'http://192.168.0.15',
    Stoplight = require('./stoplight'),
    stoplight = new Stoplight(relayHost),
    log4js = require('log4js'),
    log = new log4js.getLogger("notifications"),
    server = restify.createServer(),
    relayPath = '/stateFull.xml'

server.use(restify.bodyParser())

server.get('/busy/:state', function (state) {
    if(state) {
	stoplight.goYellow()
    } else {
	stoplight.noYellow()
    }
})

server.get('/ok', function (req, res) {
    stoplight.goGreen()
    res.send(200)
    res.end();
})

server.post('/ok', function (req, res) {
    stoplight.goGreen()
    //user body parser to process payload
    req.body
    res.send(200)
    res.end();
})

server.get('/error', function () {
    stoplight.goRed()
    res.send(200)
    res.end();
})

// add custom endpoints here
require('./jenkins')(server, stoplight)

server.listen(8111, function () {
    log.info('%s listening at %s', server.name, server.url)
    stoplight.test()
    stoplight.reset()

    //query web service for state()
})
