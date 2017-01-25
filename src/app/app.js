import angular from 'angular';
import main from './main/main.directive';
import MainCtrl from './main/main.controller';
import map from './map/map.directive';
import MapCtrl from './map/map.controller';
import control from './control/control.directive';
import ControlCtrl from './control/control.controller';
import PlatformService from './shared/platform.service';
import PositionService from './shared/position.service';
import RouteService from './shared/route.service';

import '../style/app.css';

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [
  require('angular-drag-drop')
])
  .directive('main', main)
  .controller('MainCtrl', MainCtrl)
  .directive('map', map)
  .controller('MapCtrl', MapCtrl)
  .directive('control', control)
  .controller('ControlCtrl', ControlCtrl)
  .service('PlatformService', PlatformService)
  .service('PositionService', PositionService)
  .service('RouteService', RouteService);

export default MODULE_NAME;