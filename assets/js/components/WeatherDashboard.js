var WeatherDashboard = React.createClass({

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


    componentDidMount: function() {

        // Set the state of the component with updated data

        var setData = function() {

            var data = this.props.data;

            this.setState({
                locationName: data.openweathermap.name,
                temperature: data.openweathermap.main.temp,
                humidity: data.openweathermap.main.humidity,
                wind: (data.openweathermap.wind.speed * 60 * 60) / 1000,
                weatherCode: data.openweathermap.weather[0].id,
                sunset: new Date(data.sunrise.results.sunset),
                currentTime: new Date(),
                updated: true
            });

            // Retrieve the band that the temperature fits into in the temperatureScale array of objects

            var temperatureBand = CC.Weather.getTemperatureBand(this.state.temperature, CC.Weather.temperatureScale);

            // Set appropriate body class based on temperature band

            document.getElementsByTagName('BODY')[0].className = temperatureBand.className;

        }.bind(this);

        // Subscribe to the WeatherDataset event and fire off the setData function that will update the state of our component

        PubSub.subscribe('WeatherDataSet', setData);

    },

    render: function() {

        // Create a date object using the sunset timestamp in the response from the sunset api

        var sunsetTime = this.state.sunset;

        // Create a date object for the current date as indicated by the system clock

        var currentTime = this.state.currentTime;

        // Calculate whether it's currently later than sunset and infer that it's evening

        var isEvening = currentTime > sunsetTime;

        // Set a base prefix for the icon classes based on whether or not it's evening

        var iconClassName = isEvening ? 'wi-owm-night-' : 'wi-owm-day-';

        if (this.state.updated) {
            return (
                <section id="weather">
                    <header>
                        <h1 id="location-name">{this.state.locationName}</h1>
                        <i className={'wi ' + iconClassName + this.state.weatherCode} id="condition"></i>
                    </header>
                    <footer>
                        <div id="temperature">{Math.round(this.state.temperature)}&deg;</div>
                        <div id="humidity-and-wind">
                            <div id="humidity">
                                <i className="wi wi-raindrop"></i> { this.state.humidity + '%' }</div>
                            <div id="wind">
                                <i className="wi wi-small-craft-advisory"></i> { Math.round(this.state.wind) + 'km/h' }</div>
                        </div>
                    </footer>
                </section>
            )
        } else {
            return (
                <section id="weather">
                </section>
            )
        }
    }
});

weatherApp.value('WeatherDashboard', WeatherDashboard);