var WeatherDashboard = React.createClass({
    displayName: 'WeatherDashboard',

    propTypes: {
        data: React.PropTypes.object.isRequired
    },

    getInitialState: function () {

        return {
            locationName: '',
            conditionClass: '',
            temperature: '',
            humidity: '',
            wind: '',
            weatherCode: '',
            sunset: '',
            currentTime: '',
            updated: false
        };
    },

    componentDidMount: function () {

        // Set the state of the component with updated data

        var setData = (function () {

            var data = this.props.data;

            this.setState({
                locationName: data.openweathermap.name,
                temperature: data.openweathermap.main.temp,
                humidity: data.openweathermap.main.humidity,
                wind: data.openweathermap.wind.speed * 60 * 60 / 1000,
                weatherCode: data.openweathermap.weather[0].id,
                sunset: new Date(data.sunrise.results.sunset),
                currentTime: new Date(),
                updated: true
            });

            // Retrieve the band that the temperature fits into in the temperatureScale array of objects

            var temperatureBand = CC.Weather.getTemperatureBand(this.state.temperature, CC.Weather.temperatureScale);

            // Set appropriate body class based on temperature band

            document.getElementsByTagName('BODY')[0].className = temperatureBand.className;
        }).bind(this);

        // Subscribe to the WeatherDataset event and fire off the setData function that will update the state of our component

        PubSub.subscribe('WeatherDataSet', setData);
    },

    render: function () {

        // Create a date object using the sunset timestamp in the response from the sunset api

        var sunsetTime = this.state.sunset;

        // Create a date object for the current date as indicated by the system clock

        var currentTime = this.state.currentTime;

        // Calculate whether it's currently later than sunset and infer that it's evening

        var isEvening = currentTime > sunsetTime;

        // Set a base prefix for the icon classes based on whether or not it's evening

        var iconClassName = isEvening ? 'wi-owm-night-' : 'wi-owm-day-';

        if (this.state.updated) {
            return React.createElement(
                'section',
                { id: 'weather' },
                React.createElement(
                    'header',
                    null,
                    React.createElement(
                        'h1',
                        { id: 'location-name' },
                        this.state.locationName
                    ),
                    React.createElement('i', { className: 'wi ' + iconClassName + this.state.weatherCode, id: 'condition' })
                ),
                React.createElement(
                    'footer',
                    null,
                    React.createElement(
                        'div',
                        { id: 'temperature' },
                        Math.round(this.state.temperature),
                        '°'
                    ),
                    React.createElement(
                        'div',
                        { id: 'humidity-and-wind' },
                        React.createElement(
                            'div',
                            { id: 'humidity' },
                            React.createElement('i', { className: 'wi wi-raindrop' }),
                            ' ',
                            this.state.humidity + '%'
                        ),
                        React.createElement(
                            'div',
                            { id: 'wind' },
                            React.createElement('i', { className: 'wi wi-small-craft-advisory' }),
                            ' ',
                            Math.round(this.state.wind) + 'km/h'
                        )
                    )
                )
            );
        } else {
            return React.createElement('section', { id: 'weather' });
        }
    }
});

weatherApp.value('WeatherDashboard', WeatherDashboard);
//# sourceMappingURL=components.js.map
