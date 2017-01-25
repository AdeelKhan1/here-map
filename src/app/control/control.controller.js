export default class ControlCtrl {
  constructor($scope, $element, $window, PlatformService, PositionService, RouteService) {
    this.platform = PlatformService.platform;
    this.positionService = PositionService;
    this.routeService = RouteService;
    this.$scope = $scope;

    this.searchString = "";
    this.searchResults = [];
    this.limit = 5;
  }

  fetchGeocode(params, callback) {
    this.platform.getGeocodingService().geocode(params,
      result => {
        callback(result);
      }, error => {
        console.error(error);
      });
  }

  navigate(string) {
    this.fetchGeocode({
        searchtext: string,
        gen: '8'
    }, this.positionService.selectPosition.bind(this.positionService));
  }

  search () {
    let placesService= this.platform.getPlacesService(),
      parameters = {
        at: '52.5159,13.3777',
        q: this.searchString};

    placesService.suggest(parameters,
      result => {
        this.searchResults = result.suggestions;
      }, error => {
        alert(error);
      });
  }

  getWaypointNames() {
    return this.routeService.getWaypointNames();
  }

  addToWaypoints(result) {
    this.fetchGeocode({
        searchtext: result,
        gen: '8'
    }, response => {
      this.$scope.$apply(() => {
        this.routeService.addWaypoint(response, result);
      });
    });
  }

  removeWaypoint(i) {
    this.routeService.removeWaypoint(i);
  }

  setMode(mode) {
    this.routeService.setMode(mode);
  }

  allowDrop(event) {
    event.preventDefault();
  }

  drag(event, $index) {
    event.dataTransfer.setData('index', $index);
  }

  drop(event, $index) {
    let aIndex = event.dataTransfer.getData('index');
    this.routeService.switchWaypoints(aIndex, $index);
  }
}

ControlCtrl.$inject = [
  '$scope', '$element', '$window', 'PlatformService', 'PositionService', 'RouteService'
];