'use strict';

/* Directives */


			
				
				
			
				
			

angular.module('components', [])
.directive('addroute', function () {
	return {
		restrict : 'E',
		template :
		'<div class="modal hide" id="myModal">'+
		'	<div class="modal-header">'+
		'		<button type="button" class="close" data-dismiss="modal">x</button>'+
		'		<h3>Add Route</h3>'+
		'	</div>'+
		'	<div class="modal-body">'+
		'		<form class="form-horizontal">' +
		'			<label>Service:</label>' +
		'			<input name="service" type="text" ng-model="route.service" />' +
		'			<label>description:</label>' +
		'			<textarea ng-model="route.description"></textarea></br>' +
		'			<label>Route:</label>' +
		'			<input name="route" type="text" ng-model="route.route" />' +
		'			<label>Invocation Style :</label>' +
		'			<input type="radio" ng-model="route.invocationstyle" value="sync" />sync' +
		'			<input type="radio" ng-model="route.invocationstyle" value="async" />async' +
		'			<label>Interaction Pattern:</label>' +
		'			<select ng-model="route.plugin" ng-options="plugin for plugin in plugins">' +
		'				<option value="">-- Interaction Pattern --</option>'+
		'			</select>'+
		'		</form>' +
		'		<p>{{message}}</p>' +
		'	</div>'+
		'	<div class="modal-footer">'+
		'		<a ng-click="cancel()" class="btn" data-dismiss="modal">Close</a>'+
		'		<a ng-click="save(route)" class="btn btn-primary">Save</a>'+
		'	</div>'+
		'</div>',
		controller : 'emptyController',
		compile : function (tElement, tAttrs, transclude) {
			this.controller = addRouteCtrl;
		}
	}
});
