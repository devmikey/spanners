'use strict';

/* Services */

var spanners = angular.module('routelistServices', ['ngResource']);

spanners.factory('toolEvent', function($rootScope) {
    var sharedService = {};
    
    sharedService.message = '';

    sharedService.prepForBroadcast = function(eventname, msg) {
		this.eventname = eventname;
        this.message = msg;
        this.broadcastItem(eventname);
    };

    sharedService.broadcastItem = function(eventname) {
        $rootScope.$broadcast(eventname);
    };

    return sharedService;
});

spanners.factory('Route', function ($resource) {
	return $resource('jigsaw/servicelist/:routeId', {}, {
		query : {
			method : 'GET',
			isArray : true
		}
	});
});

spanners.factory('Domains', function($resource) {
	return $resource('jigsaw/:Id', {}, {
		query : {
			method : 'GET',
			params : {
				Id : 'domains'
			},
			isArray : true
		}
	});
});

spanners.factory('Socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

spanners.factory('Graph', function ($rootScope) {
	var chart = new Highcharts.Chart({
		chart: {
			renderTo: 'messageGraph',
			type: 'spline',
			marginRight: 0
		},
		title: {
			text: 'Incoming Messages'
		},
		xAxis: {
			type: 'datetime',
			tickPixelInterval: 150
		},
		yAxis: {
			title: {
				text: 'Value'
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			formatter: function() {
					return '<b>'+ this.series.name +'</b><br/>'+
					Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
					Highcharts.numberFormat(this.y, 2);
			}
		},
		legend: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		series: [{
			name: 'Message data',
			data: (function() {
				// this needs to pull out the last n results
				var data = [],
					time = (new Date()).getTime(),
					i;

				for (i = -19; i <= 0; i++) {
					data.push({
						x: time + i * 1000,
						y: 0
					});
				}
				return data;
			})()
		}]
	});
	return {"chart": chart};
});

