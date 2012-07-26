'use strict';

/* Controllers */

function RouteListCtrl($scope, $http, Route) {
  $scope.routes = Route.query();
  $scope.orderProp = 'service';
  
  $scope.toogleService = function(route) {
     if (route.serviceStatus == 'stopped') {
		 // start the service running on jigsaw
			console.log("trying to start the service");
			
			$http({
				method : "GET",
				url : "/jigsaw/enable/" + route.route
			}).
			success(function (data, status) {
				console.log(data);
				console.log(status);
				$scope.routes = data;
			}).
			error(function (data, status) {
				console.log("failed to enable route - " +data);
				console.log(status);
			});
	 }
	 else {
			// stop the service running on jigsaw
			console.log("trying to stop the service");
			
			$http({
				method : "GET",
				url : "/jigsaw/disable/" + route.route
			}).
			success(function (data, status) {
				console.log("success route disabled - " +data);
				console.log(status);
				$scope.routes = data;
			}).
			error(function (data, status) {
				console.log("failed to disable route - " +data);
				console.log(status);
			});
	 }
  };
  
}

function addRouteCtrl($scope, $element, $attrs, $http) {

	var isRouteValid = function(route) {
		if (empty(route)) {
			throw new Error("The route details can't be empty");
		}
		if (empty(route.route)) {
			throw new Error("The route must be entered");
		}
		if (empty(route.service)) {
			throw new Error("The service must be entered");
		}
		if (empty(route.description)) {
			throw new Error("The description must be entered");
		}
		if (empty(route.invocationstyle)) {
			throw new Error("The invocation style must be selected");
		}
		return true;
	}

	//set the dialog titlebar
	$scope.myTitle = $attrs.title;
	$scope.isVisible = false;
	$scope.cancel = function (){
		$scope.toggleDisplay();
	}	
	
	$scope.save = function (route){
		// need to use a common validation library between server and client
		try {
			if (isRouteValid(route)) {
				// save and then close dialog
				$scope.toggleDisplay();
				return;
			}
		}
		catch(err){
			$scope.message = err.message;
			console.log(err);
		}
		
	}
	
	$scope.toggleDisplay = function(){
		$scope.isVisible = !$scope.isVisible;
	}
	
	// make the dialog dragabble
	$(function() {
		$('#'+$attrs.id+' .draggable').draggable();
	});
}

function empty(e) {
		return (!e || 0 === e.length);
    }

function emptyController($scope) {
}
