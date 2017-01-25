export default class ControlCtrl {
  constructor($window, $element, PlatformService, PositionService, RouteService) {
    this.platform = PlatformService.platform;
    this.positionService = PositionService;
    this.routeService = RouteService;

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
      this.routeService.addWaypoint(response, result);
    });
  }

  removeWaypoint(i) {
    this.routeService.removeWaypoint(i);
  }
}

ControlCtrl.$inject = ['$window', '$element', 'PlatformService', 'PositionService', 'RouteService'];