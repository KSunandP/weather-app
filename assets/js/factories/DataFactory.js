(function() {

    'use strict';

    var dataFactories = angular.module('DataFactories', [
        'ngResource'
    ]);

    dataFactories.factory('OpenWeatherMap', [
        '$resource',
        OpenWeatherMap
    ]);

    function OpenWeatherMap($resource) {

        var apiEndpoint = 'http://api.openweathermap.org/data/2.5/weather?appid=2de143494c0b295cca9337e1e96b00e0$&units=metric:lat:lon';

        return $resource(apiEndpoint,
            {
                callback: 'JSON_CALLBACK',
                lat: '@lat',
                lon: '@lon'
            },
            {
                getJSONP: {
                    method: "JSONP"
                },
                get: {
                    method: "GET"
                }
            }
        );
    }



    dataFactories.factory('SunriseSunset', [
        '$resource',
        SunriseSunset
    ]);

    function SunriseSunset($resource) {

        var apiEndpoint = 'http://api.sunrise-sunset.org/json?formatted=0:lat:lon';

        return $resource(apiEndpoint,
            {
                callback: "JSON_CALLBACK",
                lat: '@lat',
                lon: '@lon'
            },
            {
                getJSONP: {
                    method: "JSONP"
                },
                get: {
                    method: "GET"
                }
            }
        );
    }



    dataFactories.factory('GoogleGeoLoc', [
        '$resource',
        GoogleGeoLoc
    ]);

    function GoogleGeoLoc($resource) {

        var apiEndpoint = 'http://maps.googleapis.com/maps/api/geocode/json?sensor=true:address';

        return $resource(apiEndpoint,
            {
                callback: "JSON_CALLBACK",
                address: '@address'
            },
            {
                getJSONP: {
                    method: "JSONP"
                },
                get: {
                    method: "GET"
                }
            }
        );
    }


})();
