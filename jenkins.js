'use strict';

module.exports = function(server, stoplight) {

    server.post('/jenkins', function (req, res) {
	console.log('update from jenkins for ' + req.body.name)
	switch(req.body.build.phase) {
	    case 'COMPLETED':
		if(req.body.build.status === 'success') {
		    stoplight.goGreen();
		} else {
		    stoplight.goRed()
		}
		stoplight.stopFlashYellow()
		stoplight.noYellow()
		break
	    default:
		stoplight.startFlashYellow()
		break
	}

	res.send(200)
	res.end();
    })
}
