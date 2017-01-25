export default class MapCtrl {
  constructor($scope, $window, $element, PlatformService, PositionService) {
    this.platform = PlatformService.platform;
    this.positionService = PositionService;
    this.$onInit = () => {
      this.getWindowDimensions = function () {
          return {
              'h': $window.innerHeight,
              'w': $window.innerWidth
          };
      };

      $scope.$on('selected.position.updated', position => {
        let value = this.positionService.getPosition();
        this.map.setCenter({lat: value.Latitude, lng: value.Longitude}, true);
        this.map.setZoom(10.5, true);
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

MapCtrl.$inject = ['$scope', '$window', '$element', 'PlatformService', 'PositionService'];