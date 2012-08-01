var util = require('util'),
winston = require('winston');


var SocketIOLogger = winston.transports.SocketIOLogger = function (options) {
	//
	// Name this logger
	//
	this.name = 'socketIOLogger';
	this.io = options.io;
	
	//
	// Set the level from your options
	//
	this.level = options.level || 'info';
	
	//
	// Configure your storage backing as you see fit
	//
};

//
// Inherit from `winston.Transport` so you can take advantage
// of the base functionality and `.handleExceptions()`.
//
util.inherits(SocketIOLogger, winston.Transport);

SocketIOLogger.prototype.log = function (level, msg, meta, callback) {
	//
	// Store this message and metadata, maybe use some custom logic
	// then callback indicating success.
	//
	this.io.sockets.emit('jigsaw', meta);
	callback(null, true);
};


exports.SocketIOLogger = SocketIOLogger;