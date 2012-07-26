/**
* MODULE DEPENDENCIES
* -------------------------------------------------------------------------------------------------
* include any modules you will use through out the file
**/

var express = require('express')
  , connect = require('connect');
var http = require('http');

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
		var options = {
		  host: 'localhost',
		  port: 3000,
		  path: '/jigsaw/services',
		  method: 'GET'
		};

		var jigrequest = http.request(options, function(jigresponse) {
		  var data = "";
		  jigresponse.on('data', function (chunk) {
			data = data + chunk;
		  });
		  
		  jigresponse.on('end', function (chunk) {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(data);
			res.end();
		  });
		  
		});

		jigrequest.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});

		jigrequest.end();

	});

	app.get('/jigsaw/disable/*', function(req, res) {
		console.log("disabling service : " + req.params[0]);
		var options = {
		  host: 'localhost',
		  port: 3000,
		  path: '/jigsaw/disable/' + req.params[0],
		  method: 'GET'
		};

		var jigrequest = http.request(options, function(jigresponse) {
		  var data = "";
		  jigresponse.on('data', function (chunk) {
			data = data + chunk;
		  });
		  
		  jigresponse.on('end', function (chunk) {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(data);
			res.end();
		  });
		  
		});

		jigrequest.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});

		jigrequest.end();
	});
	
	app.get('/jigsaw/enable/*', function(req, res) {
		console.log("enabling service : " + req.params[0]);
		var options = {
		  host: 'localhost',
		  port: 3000,
		  path: '/jigsaw/enable/' + req.params[0],
		  method: 'GET'
		};

		var jigrequest = http.request(options, function(jigresponse) {
		  var data = "";
		  jigresponse.on('data', function (chunk) {
			data = data + chunk;
		  });
		  
		  jigresponse.on('end', function (chunk) {
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(data);
			res.end();
		  });
		  
		});

		jigrequest.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});

		jigrequest.end();
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
