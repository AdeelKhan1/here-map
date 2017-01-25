export default class MapCtrl {
  constructor($scope, $window, $element, PlatformService, PositionService, RouteService) {
    this.platform = PlatformService.platform;
    this.positionService = PositionService;
    this.routeService = RouteService;

    this.$onInit = () => {
      this.getWindowDimensions = function () {
          return {
              'h': $window.innerHeight,
              'w': $window.innerWidth
          };
      };

      $scope.$on('selected.position.updated', () => {
        let value = this.positionService.getPosition();
        let position = {lat: value.Latitude, lng: value.Longitude};
        this.map.setCenter(position, true);
        this.map.setZoom(10.5, true);
      });

      $scope.$on('route.waypoints.updated', () => {
        this.routeService.calculateRoute((result) => {
          let route,
              routeShape,
              strip;
          if (result.response && result.response.route) {
            this.map.getObjects().forEach(object => this.map.removeObject(object));
            // Pick the first route from the response:
            route = result.response.route[0];
            // Pick the route's shape:
            routeShape = route.shape;

            // Create a strip to use as a point source for the route line
            strip = new H.geo.Strip();

            // Push all the points in the shape into the strip:
            routeShape.forEach(point => {
              let parts = point.split(',');
              strip.pushLatLngAlt(parts[0], parts[1]);
            });

            // Create a polyline to display the route:
            let routeLine = new H.map.Polyline(strip, {
              style: { strokeColor: 'blue', lineWidth: 10 }
            });

            // Add the route polyline and the two markers to the map:
            this.map.addObjects([routeLine].concat(this.routeService.getWaypoints()));

            // Set the map's viewport to make the whole route visible:
            this.map.setViewBounds(routeLine.getBounds());
          }
        });
      });

      this.mapSize = `width: ${$window.innerWidth}px; height: ${$window.innerHeight}px`;
    }

    this.$postLink = () => {
      // Obtain the default map types from the platform object:
      this.defaultLayers = this.platform.createDefaultLayers();

      // Instantiate (and display) a map object:
      this.map = new H.Map(
        $element[0],
        this.defaultLayers.normal.map,
        {
          zoom: 10,
          center: { lat: 52.5, lng: 13.4 }
        });
      this.mapEvents = new H.mapevents.MapEvents(this.map);
      this.behavior = new H.mapevents.Behavior(this.mapEvents);
      this.ui = H.ui.UI.createDefault(this.map, this.defaultLayers);

    }
  }
}

MapCtrl.$inject = [
  '$scope', '$window', '$element', 'PlatformService', 'PositionService', 'RouteService'
];