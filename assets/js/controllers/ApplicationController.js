(function() {

    'use strict';

    weatherApp.controller('ApplicationController', ['$scope', '$timeout', 'OpenWeatherMap', 'SunriseSunset', 'GoogleGeoLoc', ApplicationController]);

    function ApplicationController($scope, $timeout, OpenWeatherMap, SunriseSunset, GoogleGeoLoc) {

        $scope.location = {};

        (function(CC) {
            'use strict';

            // Run the initial location checking

            CC.Location.init();

            /*
             *   Populate the location model with some default data
             *   This is used when navigator.geolocation is not available or access has been blocked
             */


            $scope.location.city = 'London';
            $scope.location.country = 'GB';

            // Set up a weather object that will be used to populate the react component

            $scope.weather = {
                sunrise: {},
                openweathermap: {},
                geoloc: {}
            };

            // Parameter objects to allow us to pass optional data to the $resource factories

            $scope.sunriseParams = {};
            $scope.openWeatherMapParams = {};


            // Take the values of the location model, set a localstorage item and fire off the LocationUpdate event

            $scope.submitLocation = function() {

                var location = encodeURIComponent($scope.location.city + ', ' + $scope.location.country);

                localStorage.setItem('location', location);

                document.getElementById('location-prompt').style.display = 'none';

                CC.Location.processLocation(location);

            };

            PubSub.subscribe('LocationUpdate', function() {

                // Retrieve the location from the CC.Location object

                var location = CC.Location.get();

                /*
                 *  If the location is a string, run it via Google's Geolocation API to retrieve the latitude & longitude
                 */

                if (typeof(location) === 'string') {

                    GoogleGeoLoc.get({}, {'address': '&address=' + location}).$promise.then(function (data) {

                        $scope.weather.geoloc = data.results[0].geometry.location;

                        // Update the parameter objects

                        $scope.sunriseParams.lat = '&lat=' + data.results[0].geometry.location.lat;
                        $scope.sunriseParams.lon = '&lng=' + data.results[0].geometry.location.lng;

                        $scope.openWeatherMapParams.lat = '&lat=' + data.results[0].geometry.location.lat;
                        $scope.openWeatherMapParams.lon = '&lon=' + data.results[0].geometry.location.lng;

                    });

                } else {

                    // Add the $scope.weather.geoloc to the event queue so that we have time to share our location

                    $timeout(function() {

                        $scope.weather.geoloc = {
                            lat: location.coords.latitude,
                            lng: location.coords.longitude
                        };

                    }, 0);

                    // Update the parameter objects

                    $scope.sunriseParams.lat = '&lat=' + location.coords.latitude;
                    $scope.sunriseParams.lon = '&lng=' + location.coords.longitude;

                    $scope.openWeatherMapParams.lat = '&lat=' + location.coords.latitude;
                    $scope.openWeatherMapParams.lon = '&lon=' + location.coords.longitude;

                }

                // Listen for changes to the $scope.weather.geoloc object

                $scope.$watch('weather.geoloc', function() {

                    // Use the SunriseSunset factory with the updated parameters to retrieve the current sunset time

                    SunriseSunset.getJSONP({}, $scope.sunriseParams).$promise.then(function(data) {
                        $scope.weather.sunrise = data;

                        // Publish an event once complete

                        PubSub.publish('SunriseSunset');
                    });


                    // Fire off an event if both the SunriseSunset event
                    PubSub.subscribe('SunriseSunset', function() {

                        // Use the OpenWeatherMap factory with the updated parameters to retrieve your current location's weather information
                        OpenWeatherMap.getJSONP({}, $scope.openWeatherMapParams).$promise.then(function(data) {

                            $scope.weather.openweathermap = data;

                            // Fire the WeatherDataSet event when we've updated our $scope.weather object
                            PubSub.publish('WeatherDataSet', $scope.weather);
                        });
                    });

                });


            });




        })(window.CC = window.CC || {})
    }

})();

