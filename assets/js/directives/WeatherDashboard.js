(function() {

    'use strict';

    weatherApp.directive('weather', function (reactDirective) {
        return reactDirective(WeatherDashboard);
    });

})();
