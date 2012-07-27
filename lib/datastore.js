var fs = require('fs');

var load = function(callback) {
	var filename = "./config/settings.json";
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

var save = function(settings, callback) {
	var filename = "./config/settings.json";
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

exports.setStatus = function(status, route, callback) {
 	try {
			load(function(err, livesettings) {
				if (err != undefined) {
					return callback(err);	
				}
				
				var settings = livesettings;
				
				for (var i =0 ; i < settings.length; i++){
					if (settings[i].route == route) {
						settings[i].serviceStatus = status;
						
						save(settings, function(err){
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

exports.addRoute = function(setting, callback) {
	try {
			load(function(err, livesettings) {
				if (err != undefined) {
					return callback(err);	
				}
				
				var settings = livesettings;
				settings.push(JSON.parse(setting));	
				
				save(settings, function(err){
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

exports.removeRoute = function(route, callback) {
	try {
			load(function(err, livesettings) {
				if (err != undefined) {
					return callback(err);	
				}
				
				for (var i = 0; i<livesettings.length; i++) {
					if (livesettings[i].route == route) {
						livesettings.splice(i, 1);
						save(livesettings, function(err){
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