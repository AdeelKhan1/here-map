export default class ControlCtrl {
  constructor($window, $element, PlatformService, PositionService) {
    this.platform = PlatformService.platform;
    this.searchString = "";
    this.positionService = PositionService;
    this.searchResults = [];
    this.waypoints = [];
    this.limit = 5;
  }

  navigate(string) {
    let geocoder = this.platform.getGeocodingService(),
      parameters = {
        searchtext: string,
        gen: '8'};
      
    geocoder.geocode(parameters,
      result => {
        this.positionService.selectPosition(
          result.Response.View[0].Result[0].Location.DisplayPosition
        );
      }, error => {
        alert(error);
      });
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

  addToWaypoints(result) {
    this.waypoints.push(result);
  }

  removeWaypoint(i) {
    this.waypoints.slice(i, 1);
  }
}