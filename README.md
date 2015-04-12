Stoplight
===========

This project is a REST API in node.js using restify. The API interacts with a javascript stoplight controller to turn on the lights of a stoplight.

##Stoplight

The stoplight is controled with electrical relay switches from a Xytronic temperature module. The Xytronic module has two relays that are remotely controllable from a webserver that it runs, so the relays can be flipped by making HTTP requests. 

##Rest API

The API endpoints are configured so that an automated development workflow's state can be queried and can send notifications relecting the state of operations. From these updates, the business logic of the API can track problems as they arise and are resolved, and show lights indicating the state of affairs. 

*endpoints*

GET

- /ok
- /error
- /busy/{true|false}

POST

- /jenkins

Use the [Jenkins Notification Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Notification+Plugin) to post jenkins notification messages to the REST endpoint at `/jenkins`

Testing:

Save a json payload from jenkins to a file and use cUrl to post it to the REST endpoint

(e.g. jenkins.json)

	{
	    "name": "asgard",
		"url": "job/asgard/",
		"build": {
		    "full_url": "http://localhost:8080/job/asgard/18/",
		    "number": 18,
		    "phase": "COMPLETED",
		    "status": "SUCCESS",
		    "url": "job/asgard/18/",
		    "scm": {
			"url": "https://github.com/evgeny-goldin/asgard.git",
			"branch": "origin/master",
			"commit": "c6d86dc654b12425e706bcf951adfe5a8627a517"
		    },
		    "artifacts": {
			"asgard.war": {
			    "archive": "http://localhost:8080/job/asgard/18/artifact/asgard.war"
			},
			"asgard-standalone.jar": {
			    "archive": "http://localhost:8080/job/asgard/18/artifact/asgard-standalone.jar",
			    "s3": "https://s3-eu-west-1.amazonaws.com/evgenyg-bakery/asgard/asgard-standalone.jar"
			}
		    }
		}
	}

The cUrl command would be:

	curl -H "Content-Type: application/json" --data @jenkins.json http://localhost:8111/jenkins
