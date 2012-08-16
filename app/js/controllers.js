'use strict';

/* Controllers */


function LoginCtrl($scope) {
}

function testCtrl($scope) {
	var fixtures = [
				{"desc" : "Error", 	url: "/testjigsaw/asyncerror"},
				{"desc" : "Async", 	url: "/testjigsaw/asyncmsg"},
				{"desc" : "Confirm",url: "/testjigsaw/confirmcollection"},
				{"desc" : "Batch", 	url: "/testjigsaw/getqueuebatch"},
				{"desc" : "Queue", 	url: "/testjigsaw/queuemessage"},
				{"desc" : "Sync 1", url: "/testjigsaw/syncrequestexception"},
				{"desc" : "Sync 2", url: "/testjigsaw/syncrequestresponseexception"}
			];
			
	$scope.fixtures = fixtures;
}

function sideBarCtrl($scope, toolEvent) {

	$scope.orderProp = 'service';
	$scope.displayScreen = function() {
	}
	
	$scope.toggleMenu = function(element) {	
		$('.accordion-heading').removeClass("active");
		$(element).addClass("active");
	}

	$scope.orderChanged = function(order) {
	  toolEvent.prepForBroadcast('orderChanged', order); 
	}	  
}

// domain controllers

function domainCtrl($scope, Domains, toolEvent) {
	$scope.domains = [{"name":"development"},{"name":"test"}];
	$scope.domain = $scope.domains[0];
	$scope.domainChanged = function(domain) {
		toolEvent.prepForBroadcast('domainChanged', domain.name); 
	}
	$scope.$on('newDomain', function() {
        $scope.domains.push(toolEvent.message);
    }); 
}

function addDomainCtrl($scope, toolEvent) {
	$scope.cancel = function () {
		// clear settings
	}
	
	$scope.save = function (domain) {
		try {
			if (validateDomain(domain)) {
				// save route
				
				var domainResource = $resource('/jigsaw/domain/add/', {
						isArray : true
					});
				
				var newDomain = new domainResource(domain);
				newDomain.$save();
				toolEvent.prepForBroadcast('newDomain', newDomain); 
				return;
			}
		} catch (err) {
			$scope.message = err.message;
		}
	}
}

// route controller

function RouteListCtrl($scope, $http, Route, toolEvent) {
	var domain = $('#domainPicker option:selected').text();
	$scope.routes =  Route.query({routeId : domain});
	$scope.orderProp = 'service';
	
	$scope.$on('domainChanged', function() {
       $scope.routes = Route.query({routeId : toolEvent.message});
    });    
	
	$scope.$on('orderChanged', function() {
        $scope.orderProp = toolEvent.message;
    });   

	$scope.$on('newRoute', function() {
        $scope.routes.push(toolEvent.message);
    }); 	
	
	$scope.deleteRoute = function(route) {
		$http({
			method : "GET",
			url : "/jigsaw/services/route/delete/" + route.route
		}).
		success(function (data, status) {
			$scope.routes = data;
		}).
		error(function (data, status) {
			// do something here
		});
	}
  
	$scope.toogleRoute = function(route) {
		if (route.serviceStatus == 'stopped') {
			// start the service running on jigsaw	
			$http({
				method : "GET",
				url : "/jigsaw/services/route/enable/" + route.route
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
				url : "/jigsaw/services/route/disable/" + route.route
			}).
			success(function (data, status) {
				console.log(status);
				$scope.routes = data;
			}).
			error(function (data, status) {
				console.log(status);
			});
		 }
	};
}

var newRouteCtrl = function ($scope, $resource, toolEvent) {
	// need to dynamically load this
	$scope.plugins = ["asyncRequestResponseException", "requestException", "syncRequestResponseException"]
	$scope.clear = function () {
	}
	
	$scope.save = function (routes) {
		try {
			if (validateSettings(routes)) {
				// save route
				
				var routeResource = $resource('/jigsaw/services/route/new', {
						isArray : true
					});
				
				var newRoute = new routeResource(routes);
				newRoute.custommiddleware = [];
				newRoute.serviceStatus = "stopped";
				newRoute.$save();
				toolEvent.prepForBroadcast('newRoute', newRoute); 
				return;
			}
		} catch (err) {
			$scope.message = err.message;
		}
	}
}

// Graph controllers

function GraphCtrl($scope, Graph, Socket) {
	$scope.counter = 0;
	setInterval(function() {
		var timestamp = (new Date()).getTime(); // current time
		Graph.chart.series[0].addPoint([timestamp, $scope.counter], true, true);
		$scope.counter = 0;
	}, 2000);
	
	Socket.on('itkevents', function (data) {
			$scope.counter++;
	});
			
}

var LogCtrl = function($scope, Socket) {
		
	$scope.jigsaw = "";
	$scope.spanners = "";
	$scope.jigsawsettings = "";
	$scope.itkevents = "";
	
	Socket.on('spanners', function (data) {
			$scope.spanners = data.message;
			Socket.emit('clientquery', { 'message': 'thanks spanners for message' });
		});
		
	Socket.on('jigsaw', function (data) {
			$scope.jigsaw = data.message + '\n\r' + $scope.jigsaw;
			Socket.emit('clientquery', { 'message': 'thanks jigsaw for message' });
		});
		
	Socket.on('jigsawsettings', function (data) {
			$scope.jigsawsettings = "route : " +data.message.route + " " +data.message.settingdescription + '\n\r' + $scope.jigsawsettings;
			Socket.emit('clientquery', { 'message': 'spanners client received setting change'});
		});
		
	Socket.on('itkevents', function (data) {
			$scope.itkevents = "events : " +data.message + '\n\r' + $scope.itkevents;
			Socket.emit('clientquery', { 'message': 'spanners client received setting change'});
		});
		
}

function emptyController() {
}


// should go into lib rather then controller
function empty(e) {
	return (!e || 0 === e.length);
}

var validateDomain = function(domain) {
	// add validation
	return true;
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
