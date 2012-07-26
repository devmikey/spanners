'use strict';

/* App Module */

angular.module('routelist', ['components','routelistFilters', 'routelistServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/routes', {templateUrl: 'partials/route-list.html',   controller: RouteListCtrl}).
      otherwise({redirectTo: '/routes'});
}]);
