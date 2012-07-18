'use strict';

/* Controllers */

function RouteListCtrl($scope, Route) {
  $scope.routes = Route.query();
  $scope.orderProp = 'service';
  
  $scope.toogleService = function(route) {
     if (route.serviceStatus == 'stopped') {
		 // start the service running on jigsaw
		 route.serviceStatus = 'started';
	 }
	 else {
	    // start the service running on jigsaw
		route.serviceStatus = 'stopped';
	 }
  };
  
}

//RouteListCtrl.$inject = ['$scope', 'Route'];

function RouteDetailCtrl($scope, $routeParams, Route) {
  $scope.route = Route.get({routeId: $routeParams.routeId}, function(route) {
    $scope.mainImageUrl = route.images[0];
  });

  $scope.setImage = function(imageUrl) {
    $scope.mainImageUrl = imageUrl;
  }
}

//RouteDetailCtrl.$inject = ['$scope', '$routeParams', 'Route'];
