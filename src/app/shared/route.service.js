export default class RouteService {
    constructor($rootScope, PlatformService) {
        this.$rootScope = $rootScope;
        this.platform = PlatformService.platform;

        this.router = this.platform.getRoutingService();

        this.mode = 'fastest;car';
        this.waypoints = [];
        this.names = [];
        this.representation = 'display';
    }

    setMode(mode) {
        this.mode = `fastest;${mode}`;
    }

    calculateRoute(callback) {
        this.router.calculateRoute(this.getParameters(), callback, (error) => {
          console.log('calculateRoute:', error);
        });
    }

    getWaypoints() {
        return this.waypoints;
    }

    getWaypointNames() {
        return this.names;
    }

    addWaypoint(result, name) {
        if (result.Response.View.length) {
            let value = result.Response.View[0].Result[0].Location.DisplayPosition;
            let position = {lat: value.Latitude, lng: value.Longitude};
            let newMarker = new H.map.Marker(position);
            this.waypoints.push(newMarker);
            this.names.push(name);
            if (this.waypoints.length > 1) {
                this.$rootScope.$broadcast('route.waypoints.updated');
            }
        }
    }

    removeWaypoint(i) {
        this.waypoints.splice(i, 1);
        this.names.splice(i, 1);
        this.$rootScope.$broadcast('route.waypoints.updated');
    }

    getParameters() {
        let parameters = {
            mode: this.mode,
            representation: this.representation
        };
        this.waypoints.forEach((waypoint, idx) => {
            parameters[`waypoint${idx}`] = this.getMarkerGeoString(waypoint);
        });
        return parameters;
    }

    getMarkerGeoString(marker) {
        let position = marker.bb;
        return `geo!${position.lat},${position.lng}`;
    }
}

RouteService.$inject = ['$rootScope', 'PlatformService'];