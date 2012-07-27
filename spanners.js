/**
* MODULE DEPENDENCIES
* -------------------------------------------------------------------------------------------------
* include any modules you will use through out the file
**/

var express = require('express');
var connect = require('connect');
var http = require('http');
var datastore = require('./lib/datastore.js');

var app = module.exports = express.createServer();

/**
* CONFIGURATION
* -------------------------------------------------------------------------------------------------
* set up any custom middleware (errorHandler), custom Validation (signatureValidator)
**/

app.configure(function() {
	app.use(express.methodOverride());
	app.use(connect.static(__dirname +'/app'));
	app.use(app.router);
});

app.configure('development', function() {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

/**
* ROUTING
* -------------------------------------------------------------------------------------------------
* dynamic route loaders
**/
	// get jigsaw service information
	app.get('/jigsaw/services', function(req, res) {
		// load from file instead of jigsaw
		datastore.loadSettings(function(err, data) {
			if (err != undefined ) {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.write(err);
				res.end();
			}
			else {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(data));
				res.end();		
			}
			
		});

	});

	app.post('/jigsaw/services/add', function(req, res) {
		console.log("new service added");
		// need to validate first
		// post onto the appropriate jigsaw server
		// return a valid response
		var data = "";
		
		req.on('data', function (chunk) {
			data = data + chunk;
		});

		req.on('end', function (chunk) {
			// add the settings
			datastore.addRoute(data, function(err, data) {
				if (err != undefined ) {
					res.writeHead(500, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify(err));
					res.end();
				}
				else {
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify(data));
					res.end();		
				}	
			});
		});
	});
	
	app.get('/jigsaw/services/delete/*', function(req, res) {
		console.log("deleting service: " +req.params[0]);
		
		datastore.removeRoute(req.params[0], function(err, data) {
				if (err != undefined ) {
					res.writeHead(500, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify(err));
					res.end();
				}
				else {
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify(data));
					res.end();		
				}	
			});
	});
	
	app.get('/jigsaw/disable/*', function(req, res) {
	
		datastore.setStatus("stopped", req.params[0], function(err, data) {
			if (err != undefined ) {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(err));
				res.end();
			}
			else {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(data));
				res.end();		
			}	
		});

	});
	
	app.get('/jigsaw/enable/*', function(req, res) {
		
			datastore.setStatus("started", req.params[0], function(err, data) {
			if (err != undefined ) {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(err));
				res.end();
			}
			else {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(data));
				res.end();		
			}	
		});
		
	});
	
/* global routes - these should be last */
app.get('/403', function(req, res) {
	throw new Error('This is a 403 Error');
});

// manual 500 error
app.get('/500', function(req, res) {
	throw new Error('This is a 500 Error');
});

// wildcard route for 404 errors
app.get('/*', function(req, res) {
	throw new Error("Not Found");
});

// home page
app.get('/', function(req, res) {
	res.render('index', { title: 'Pipecleaning Page ' })
});


app.listen(4000);
