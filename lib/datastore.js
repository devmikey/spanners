var fs = require('fs');

var load = function(filename, callback) {
	fs.readFile(filename, function (err, data) {
		if (err) {
			if (err.errno === process.ENOENT) {
			// Ignore file not found errors and return an empty result
				callback(null, "");
		} else {
			// Pass other errors through as is
			callback(err);
		}
		} else {
			// Pass successes through as it too.
			callback(null, JSON.parse(data));
		}
	})
}

var save = function(settings, filename, callback) {
	fs.writeFile(filename, JSON.stringify(settings),  function (err) {
		if (err) {
			if (err.errno === process.ENOENT) {
			// Ignore file not found errors and return an empty result
				return callback(null, "");
		} else {
			// Pass other errors through as is
			return callback(err);
		}
		} else {
			// Pass successes through as it too.
			return callback(null);
		}
	})
}

exports.setStatus = function(status, route, filename, callback) {
 	try {
			load(filename, function(err, settings) {
				if (err != undefined) {
					return callback(err);	
				}
				
				for (var i =0 ; i < settings.length; i++){
					if (settings[i].route == route) {
						settings[i].serviceStatus = status;
						
						save(settings, filename, function(err){
							if (err != undefined) {
								return callback(err);
							}
							else {
								return callback(null, settings);
							}					
						});
						
						break;
					}
				}
		});		
	}
	catch (err) {
		callback(err);
	}	
}

exports.addRoute = function(setting, filename, callback) {
	try {
			load(filename, function(err, livesettings) {
				if (err != undefined) {
					return callback(err);	
				}
				
				var settings = livesettings;
				settings.push(JSON.parse(setting));	
				
				save(settings, filename, function(err){
					if (err != undefined) {
						return callback(err);
					}
					else {
						return callback(null, JSON.parse(setting));
					}					
				});
		});
	}
	catch (err) {
		callback(err);
	}	
}

exports.removeRoute = function(route, filename, callback) {
	try {
			load(filename, function(err, livesettings) {
				if (err != undefined) {
					return callback(err);	
				}
				
				for (var i = 0; i<livesettings.length; i++) {
					if (livesettings[i].route == route) {
						livesettings.splice(i, 1);
						save(livesettings, filename, function(err){
							if (err != undefined) {
								return callback(err);
							}
							else {
								return callback(null, livesettings);
							}					
						});
						break;
					}
				}		
		});
	}
	catch (err) {
		callback(err);
	}	
}

exports.loadSettings = load;