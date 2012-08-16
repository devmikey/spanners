'use strict';

/* App Module */

angular.module('routelist', ['routelistFilters', 'routelistServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/routes', {templateUrl: 'partials/routelist.html',   controller: RouteListCtrl});
  
   $routeProvider.
      when('/graphs', {templateUrl: 'partials/graphs.html',   controller: GraphCtrl});
	  
  $routeProvider.
      when('/helpconfiguration', {templateUrl: 'partials/help/config.html',   controller: emptyController});
  
  $routeProvider.
      when('/login', {templateUrl: 'partials/login.html',   controller: LoginCtrl});
	  
  // last route
  $routeProvider.  
	  when('/logs', {templateUrl: 'partials/logs.html',   controller: LogCtrl}).
      otherwise({redirectTo: '/routes'});
}]);
