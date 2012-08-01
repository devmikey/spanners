/**
* MODULE DEPENDENCIES
* -------------------------------------------------------------------------------------------------
* include any modules you will use through out the file
**/

var express = require('express');
var connect = require('connect');
var http = require('http');
var winstond = require('winstond');
var iologger = require('./lib/winston-socketio.js');

// socket.io  needs to be configured like below - see https://github.com/LearnBoost/socket.io/issues/785
var app = express();
var server = app.listen(4000);
var io = require('socket.io').listen(server);

var winstondserver = winstond.nssocket.createServer({
  services: ['collect', 'query', 'stream'],
  port: 9003
});

winstondserver.add(iologger.SocketIOLogger, {"io": io});
winstondserver.listen();

var report = io.sockets.on('connection', function (socket) {
  socket.emit('spanners', { 'message': 'socket connected' });
    socket.on('clientquery', function (data) {
		console.log(data);
  });
});


/**
* CONFIGURATION
* -------------------------------------------------------------------------------------------------
* set up any custom middleware (errorHandler), custom Validation (signatureValidator)
**/

app.configure(function() {
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: "keyboard cat" }));
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

		var options = {
		  host: 'localhost',
		  port: 3000,
		  path: '/jigsaw/services',
		  method: 'GET'
		};
		
		invokejigsaw(null, options, function(err, data) {
			if (err != undefined ) {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(err));
				res.end();
			}
			else {
				//restart(req,res);
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(data);
				res.end();
			}	
		});
	});
	
var restart = function(req, res) {
		var options = {
		  host: 'localhost',
		  port: 3000,
		  path: '/jigsaw/restart',
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

	};
	
	app.post('/jigsaw/services/add', function(req, res) {
		// need to validate first
		// post onto the appropriate jigsaw server
		// return a valid response
		var data = "";
		
		req.on('data', function (chunk) {
			data = data + chunk;
		});

		req.on('end', function (chunk) {
			// add the settings
			var options = {
			  host: 'localhost',
			  port: 3000,
			  path: '/jigsaw/services/add',
			  method: 'POST'
			};
			invokejigsaw(data, options, function(err, data) {
				if (err != undefined ) {
					res.writeHead(500, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify(err));
					res.end();
				}
				else {
					//restart(req,res);
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.write(data);
					res.end();
				}	
			});
		});
	});
	
	
	function invokejigsaw(postdata, options, callback) {
		var jigrequest = http.request(options, function(jigresponse) {
		  var data = "";
		  jigresponse.on('data', function (chunk) {
			data = data + chunk;
		  });
		  jigresponse.on('end', function (chunk) {
			return callback(null, data)
		  });

		});
		
		jigrequest.on('error', function(e) {
		  return callback(new Error('problem with request: ' + e.message));
		});
		if (postdata != null) {
			jigrequest.write(postdata);
		}
		jigrequest.end();
	}
	
	app.get('/jigsaw/services/delete/*', function(req, res) {
		var options = {
		  host: 'localhost',
		  port: 3000,
		  path: '/jigsaw/services/delete/'+req.params[0],
		  method: 'GET'
		};
		
		invokejigsaw(null, options, function(err, data) {
			if (err != undefined ) {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(err));
				res.end();
			}
			else {
				//restart(req,res);
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(data);
				res.end();
			}	
		});	
			
	});
	
	app.get('/jigsaw/services/disable/*', function(req, res) {
		var options = {
		  host: 'localhost',
		  port: 3000,
		  path: '/jigsaw/services/disable/'+req.params[0],
		  method: 'GET'
		};
		
		invokejigsaw(null, options, function(err, data) {
			if (err != undefined ) {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(err));
				res.end();
			}
			else {
				//restart(req,res);
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(data);
				res.end();
			}	
		});	

	});
	
	app.get('/jigsaw/services/enable/*', function(req, res) {
		var options = {
		  host: 'localhost',
		  port: 3000,
		  path: '/jigsaw/services/enable/'+req.params[0],
		  method: 'GET'
		};
		
		invokejigsaw(null, options, function(err, data) {
			if (err != undefined ) {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(err));
				res.end();
			}
			else {
				//restart(req,res);
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(data);
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
	throw new Error("Not Found: " + req.url);
});

// home page
app.get('/', function(req, res) {
	res.render('index', { title: 'Pipecleaning Page ' })
});

console.log("spanners is running on http://localhost:4000/");

