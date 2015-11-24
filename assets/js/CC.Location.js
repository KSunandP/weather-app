;(function(CC) {
    CC.Location = {

        location: {},

        init: function() {
            if ('geolocation' in navigator) {
                this.getCurrentLocation();
            } else {
                this.promptForLocation();
            }
        },

        get: function() {
          return this.location;
        },

        getCurrentLocation: function() {
            navigator.geolocation.getCurrentPosition(this.processLocation, function (error) {

                var handleFailover = function() {
                    if (localStorage.getItem('location') === null) {
                        CC.Location.promptForLocation();
                    } else {
                        CC.Location.location = localStorage.getItem('location');
                        PubSub.publish('LocationUpdate', CC.Location.location);
                    }
                };

                if (error.code == error.POSITION_UNAVAILABLE) {
                    handleFailover();
                }

                if (error.code == error.PERMISSION_DENIED) {
                    handleFailover();
                }

            }.bind(this));
        },

        promptForLocation: function() {
            document.getElementById('location-prompt').style.display = 'flex';
        },

        processLocation: function(location) {
            CC.Location.location = location;
            PubSub.publish('LocationUpdate', CC.Location.location);
            localStorage.removeItem('location');

        }

    };
})(window.CC = window.CC || {});