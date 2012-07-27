'use strict';

/* Controllers */

function RouteListCtrl($scope, $http, Route) {
  $scope.routes = Route.query();
  $scope.orderProp = 'service';
  $scope.deleteService = function(route) {
		$http({
				method : "GET",
				url : "/jigsaw/services/delete/" + route.route
			}).
			success(function (data, status) {
				$scope.routes = data;
			}).
			error(function (data, status) {
				console.log("failed - deleting service - " +data);
				console.log(status);
			});
  }
  
  $scope.toogleService = function(route) {
     if (route.serviceStatus == 'stopped') {
		 // start the service running on jigsaw
			console.log("trying to start the service");
			
			$http({
				method : "GET",
				url : "/jigsaw/enable/" + route.route
			}).
			success(function (data, status) {
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
				$scope.routes = data;
			}).
			error(function (data, status) {
				console.log("failed to disable route - " +data);
				console.log(status);
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
