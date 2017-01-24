import angular from 'angular';
import map from './map/map.directive';
import MapCtrl from './map/map.controller';
import control from './control/control.directive';
import ControlCtrl from './control/control.controller';
import PlatformService from './shared/platform.service';
import PositionService from './shared/position.service';

import '../style/app.css';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  constructor($window) {
  }
}

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl)
  .directive('map', map)
  .controller('MapCtrl', MapCtrl)
  .directive('control', control)
  .controller('ControlCtrl', ControlCtrl)
  .service('PlatformService', PlatformService)
  .service('PositionService', PositionService);

export default MODULE_NAME;