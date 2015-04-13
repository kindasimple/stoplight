'use strict';

module.exports = function(server, stoplight) {

    server.post('/jenkins', function (req, res) {
	console.log('update from jenkins for ' + req.body.name)
	switch(req.body.build.phase) {
	    case 'COMPLETED':
		if(req.body.build.status === 'success') {
		    stoplight.green()
			.then(function () {
			    res.json(200, stoplight.toJSON())
			})
			.fail(function () {
			    res.json(500, stoplight.toJSON())
			})
		} else {
		    stoplight.red()
			.then(function () {
			    res.json(200, stoplight.toJSON())
			})
			.fail(function () {
			    res.json(500, stoplight.toJSON())
			})
		}
		break
	    default:
		stoplight.busy()
		    .then(function () {
			res.json(200, stoplight.toJSON())
		    })
		    .fail(function () {
			res.json(500, stoplight.toJSON())
		    })
		break
	}
    })
}
