Stoplight
===========

This project is a REST API in node.js using restify. The API interacts with a javascript stoplight controller to turn on the lights of a stoplight.

##Stoplight

The stoplight is controled with electrical relay switches from a Xytronic temperature module. The Xytronic module has two relays that are remotely controllable from a webserver that it runs, so the relays can be flipped by making HTTP requests. 

##Rest API

The API endpoints are configured so that an automated development workflow's state can be queried and can send notifications relecting the state of operations. From these updates, the business logic of the API can track problems as they arise and are resolved, and show lights indicating the state of affairs. 
