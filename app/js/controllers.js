'use strict';

/* Controllers */

function RouteListCtrl($scope, $http, socket, Route) {
	$scope.jigsaw = "Empty";
	$scope.spanners = "Empty";
	$scope.routes = Route.query();
	$scope.orderProp = 'service';

	socket.on('spanners', function (data) {
			$scope.spanners = data.message;
			socket.emit('clientquery', { 'message': 'thanks spanners for message' });
		});
		
	socket.on('jigsaw', function (data) {
			$scope.jigsaw = data.message;
			socket.emit('clientquery', { 'message': 'thanks jigsaw for message' });
		});
  
	$scope.deleteService = function(route) {
		$http({
			method : "GET",
			url : "/jigsaw/services/delete/" + route.route
		}).
		success(function (data, status) {
			$scope.routes = data;
		}).
		error(function (data, status) {
			// do something here
		});
  }
  
  $scope.toogleService = function(route) {
    if (route.serviceStatus == 'stopped') {
		// start the service running on jigsaw	
		$http({
			method : "GET",
			url : "/jigsaw/services/enable/" + route.route
		}).
		success(function (data, status) {
			$scope.routes = data;
		}).
		error(function (data, status) {
			// do something here
		});
	 }
	 else {
		$http({
			method : "GET",
			url : "/jigsaw/services/disable/" + route.route
		}).
		success(function (data, status) {
			$scope.routes = data;
		}).
		error(function (data, status) {
			// do something here
		});
	 }
  };
}

// should go into lib rather then controller
function empty(e) {
	return (!e || 0 === e.length);
}

function emptyController($scope) {
}

var validateSettings = function (settings) {
		if (empty(settings)) {
			throw new Error("Please enter the settings");
		}
		if (empty(settings.plugin)) {
			throw new Error("The plugin name is missing");
		}
		if (empty(settings.route)) {
			throw new Error("The route is missing");
		}
		if (empty(settings.service)) {
			throw new Error("The service is missing");
		}
		if (empty(settings.description)) {
			throw new Error("The description is missing");
		}
		if (empty(settings.invocationstyle)) {
			throw new Error("The invocation style is missing");
		}
		return true;
	}
	
var addRouteCtrl = function ($scope, $element, $attrs, $resource) {
	// need to dynamically load this
	$scope.plugins = ["asyncRequestResponseException", "requestException", "syncRequestResponseException"]
	$scope.cancel = function () {
	}
	
	$scope.save = function (settings) {
		try {
			if (validateSettings(settings)) {
				// save route
				
				var routeResource = $resource('/jigsaw/services/add/', {
						isArray : true
					});
				
				var newSetting = new routeResource(settings);
				newSetting.custommiddleware = [];
				newSetting.serviceStatus = "stopped";
				newSetting.$save();
				$scope.routes.push(newSetting);
				$scope.toggleDisplay();
				return;
			}
		} catch (err) {
			$scope.message = err.message;
		}
	}
	
	$scope.toggleDisplay = function () {
		$('#myModal').modal('toggle');
	}

}