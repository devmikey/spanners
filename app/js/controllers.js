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

// should go into lib rather then controller
function empty(e) {
		return (!e || 0 === e.length);
}

function emptyController($scope) {
}
