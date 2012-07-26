'use strict';

/* Services */

angular.module('routelistServices', ['ngResource']).
factory('Route', function ($resource) {
	return $resource('jigsaw/:routeId', {}, {
		query : {
			method : 'GET',
			params : {
				routeId : 'services'
			},
			isArray : true
		}
	});
});
