'use strict';

/* Directives */

angular.module('components', [])
.directive('addroute', function () {
		return {
			restrict: 'E',
			transclude: true,
			template: 
			'<div ng-transclude ng-show="isVisible"  class="draggable shadow dialog"><h3>Add New Route</h3>'+
			'<form>'+
			'<span>Service:</span></br>'+
			'<input name="service" type="text" ng-model="route.service" /></br>'+
			'<span>description:</span></br>'+
			'<textarea ng-model="route.description"></textarea></br>'+
			'<span>Route:</span></br> '+
			'<input name="route" type="text" ng-model="route.route" /></br>'+
			'<span>Invocation Style :</span>'+
			'<input type="radio" ng-model="route.invocationstyle" value="sync" />sync'+
			'<input type="radio" ng-model="route.invocationstyle" value="async" />async'+
			'</br></br>'+
			'<button class="minimal" ng-click="cancel()">Cancel</button>'+
			'<button class="minimal" ng-click="save(route)">Save</button>'+
			'</form>'+
			'<p>{{message}}</p>'+
			'</div>',
			controller : 'emptyController',
			compile: function(tElement, tAttrs, transclude) {
				this.controller = 			
					function addRouteCtrl($scope, $element, $attrs, $resource, Route) {
						var validate = function(route) {
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

						$scope.isVisible = false;
						$scope.cancel = function (){
							$scope.toggleDisplay();
						}	
					
						$scope.save = function (route){
							try {
								if (validate(route)) {
									// save route
									
									var routeResource = $resource('/jigsaw/services/add/', {isArray:true});
									
									var newRoute = new routeResource(route);
									newRoute.custommiddleware = [];
									newRoute.serviceStatus = "stopped";
									newRoute.$save();
									$scope.toggleDisplay();
									$scope.routes.push(newRoute);
									return;
								}
							}
							catch(err){
								$scope.message = err.message;
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
			}
		}
	});