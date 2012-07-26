'use strict';

/* Directives */

angular.module('components', [])
.directive('dialog', function () {
		return {
		restrict: 'E',
		transclude: true,
		template: '<div ng-transclude ng-show="isVisible"  class="draggable shadow dialog"><h3>{{myTitle}}</h3></div>',
		controller : 'emptyController',
		compile: function(tElement, tAttrs, transclude) {
			this.controller = tAttrs.controller;	
		}
	}
});