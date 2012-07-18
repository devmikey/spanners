'use strict';

/* App Module */

angular.module('routelist', ['routelistFilters', 'routelistServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/routes', {templateUrl: 'partials/route-list.html',   controller: RouteListCtrl}).
      when('/routes/:routeId', {templateUrl: 'partials/route-detail.html', controller: RouteDetailCtrl}).
      otherwise({redirectTo: '/routes'});
}]);
