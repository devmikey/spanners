/**
* MODULE DEPENDENCIES
* -------------------------------------------------------------------------------------------------
* include any modules you will use through out the file
**/

var childProcess = require('child_process');
var express = require('express');
var connect = require('connect');
var winstond = require('winstond');
var iologger = require('./lib/winston-socketio.js');
var datastore = require('./lib/datastore.js');
// socket.io  needs to be configured like below - see https://github.com/LearnBoost/socket.io/issues/785
var app = express();
var server = app.listen(4000);
var io = require('socket.io').listen(server);

var settingsFile = "c:/users/devmikey/documents/github/spanners/config/settings.json";
var pluginFile = "c:/users/devmikey/documents/github/jigsaw/config/plugins.json";
var publicKey = "C:/Users/devmikey/Documents/GitHub/Jigsaw/certs-server/server_public.pem";


var winstondserver = winstond.nssocket.createServer({
  services: ['collect', 'query', 'stream'],
  port: 9003
});

winstondserver.add(iologger.SocketIOLogger, {"io": io});
winstondserver.listen();

var jigsawServers = new Array();

var report = io.sockets.on('connection', function (socket) {
  socket.emit('spanners', { 'message': 'socket connected' });
    socket.on('clientquery', function (data) {
		console.log(data);
  });
});

// move this into a module
var startJigsaw = function(){	
	/* move all of this configuration into the spanners configuration db */
	datastore.loadSettings(settingsFile, function(err, settingsdata ) {
		var settings = JSON.parse(settingsdata);
		if (err) {
			throw new Error(err);			
		}
		datastore.loadSettings(pluginFile, function(err, plugins) {
			
			if (err) {
				throw new Error(err);
			}
			// for each instance of a server
			for (var domains =0; domains < settings.length; domains++) {
				console.log("starting node server " + [JSON.stringify(settings[domains])] + " " + plugins + " " +publicKey);
				var routeConfig = JSON.stringify(settings[domains]);
				jigsawServers.push(childProcess.fork('../jigsaw/server',[routeConfig, plugins, publicKey]));
				
				jigsawServers[jigsawServers.length-1].on('exit', function (code, signal) {
				  console.log('child process terminated due to receipt of signal '+signal +' code ' +code);
				});
				
			}
		})
	})
}


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
	app.get('/jigsaw/servicelist/*', function(req, res) {
		var app = req.app;
		var domain = req.params[0];
		app.domain = domain;
		
		datastore.loadSettings(settingsFile, function(err, data) {
			if (err != undefined) {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(err));
				res.end();
			}
			
			var domainIdx;
			var settings = JSON.parse(data);
			
			for (var dom = 0; dom < settings.length; dom ++) {
				if (settings[dom].name == domain) {
					 domainIdx = dom;
				}
			}		
			
			if (domainIdx == undefined)	{
				return callback(new Error("Unknown domain : " + domain));
			}
			
			app.routes = settings[domainIdx].routes;
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(app.routes));
			res.end();		
		})	
	});
	
	// list of domains
	app.get('/jigsaw/domains', function(req, res) {
		
		datastore.loadSettings(settingsFile, function(err, data) {
			if (err != undefined) {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(err));
				res.end();
			}
			
			var settings = JSON.parse(data);
			var domains = new Array();
			for (var dom = 0; dom < settings.length; dom ++) {
				domains.push({"name" : settings[dom].name});
			}		
		
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify(domains));
			res.end();		
		})	
	});
	
	app.post('/jigsaw/services/domain/new', function(req, res) {
		var data = "";
		
		req.on('data', function (chunk) {
			data = data + chunk;
		});

		req.on('end', function (chunk) {
			datastore.addDomain(data, settingsFile, function(err) {
				if (err != undefined ) {
					res.writeHead(500, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify(err));
					res.end();
				}
				else {
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.write(data);
					res.end();		
				}	
			});
			
		});
	});
	
	app.post('/jigsaw/services/route/new', function(req, res) {
		// need to validate first
		// post onto the appropriate jigsaw server
		// return a valid response
		var app = req.app;
		var domain = app.domain;
		var data = "";
		
		req.on('data', function (chunk) {
			data = data + chunk;
		});

		req.on('end', function (chunk) {
			datastore.addRoute(data, domain, settingsFile, function(err, data) {
				if (err != undefined ) {
					res.writeHead(500, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify(err));
					res.end();
				}
				else {
					//restart(req,res);
					data.settingdescription = "added";
					res.writeHead(200, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify(data));
					res.end();		
				}	
			});
			
		});
	});

	app.get('/jigsaw/services/route/delete/*', function(req, res) {
		var app = req.app;
		var domain = app.domain;
		
		datastore.removeRoute(req.params[0], domain, settingsFile,  function(err, data) {
			if (err != undefined ) {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(err));
				res.end();
			}
			else {
				data.settingdescription = "deleted";
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(data));
				res.end();		
			}	
		});
			
	});	
	
	app.get('/jigsaw/services/route/disable/*', function(req, res) {
		// need to pass in domain from client
		datastore.setStatus("stopped", app.domain, req.params[0], settingsFile, function(err, data) {
			if (err != undefined ) {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(err));
				res.end();
			}
			else {
				data.settingdescription = "disabled";
				app.routes = data;
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(data));
				res.end();		
			}	
		});
		
		// just need to tell jigsaw to reload services now

	});
	
	app.get('/jigsaw/services/route/enable/*', function(req, res) {
		// need to pass in domain from client
		datastore.setStatus("started", app.domain, req.params[0], settingsFile, function(err, data) {
			if (err != undefined ) {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(err));
				res.end();
			}
			else {
				data.settingdescription = "disabled";
				app.routes = data;
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify(data));
				res.end();		
			}	
		});
		
		// just need to tell jigsaw to reload services now
		
	});

	// home page
app.get('/', function(req, res) {
	res.redirect('/routes');
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

startJigsaw();

console.log("spanners is running on http://localhost:4000/");

