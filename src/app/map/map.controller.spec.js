describe('MapCtrl', () => {
    let ctrl, $scope, $rootScope, $timeout, $window, element, PlatformService, PositionService,
        RouteService;
    
    class FakeRouter {
        constructor() {
            this.isFake = true;
        }
    }
    class FakeMapEvents {
        constructor() {
            this.isFake = true;
        }
    }
    class FakeBehavior {
        constructor() {
            this.isFake = true;
        }
    }
    class FakeMap {
        constructor() {
            this.isFake = true;
        }
    }
    class FakeDataModel {
        constructor() {
            this.isFake = true;
        }
    }
    class FakeLayers {
        constructor() {
            this.isFake = true;
            this.normal = {
                map: {normal: {traffic: 'foo'}}
            }
        }
    }

    beforeEach(() => {
        angular.mock.module('app');

        angular.mock.inject((
            _$controller_, _$rootScope_, _$window_, _PlatformService_, _PositionService_,
            _RouteService_
        ) => {
            $rootScope = _$rootScope_;
            $window = _$window_;
            $scope = $rootScope.$new();
            element = angular.element('<div></div>');
            PlatformService = _PlatformService_;
            PositionService = _PositionService_;
            RouteService = _RouteService_;

            PlatformService.platform = {
                getRoutingService: () => true,
                createDefaultLayers: () => true
            };
            window.H.mapevents = {
                MapEvents: () => {},
                Behavior: () => {}
            }
            window.H.ui.UI = {
                createDefault: () => {}
            }

            spyOn(
                PlatformService.platform, 'getRoutingService'
            ).and.returnValue(new FakeRouter());
            spyOn(window.H.mapevents, 'MapEvents').and.returnValue(new FakeMapEvents());
            spyOn(window.H.mapevents, 'Behavior').and.returnValue(new FakeBehavior());
            spyOn(window.H.ui.UI, 'createDefault');
            spyOn(window.H.map, 'DataModel').and.returnValue(new FakeDataModel());
            spyOn(window.H, 'Map').and.returnValue(new FakeMap());
            spyOn(
                PlatformService.platform, 'createDefaultLayers'
            ).and.returnValue(new FakeLayers());


            ctrl = _$controller_('MapCtrl', {
                $scope: $scope,
                $window: _$window_,
                $timeout: $timeout,
                $element: element,
                PlatformService: PlatformService,
                PositionService: PositionService,
                RouteService: RouteService
            });
        });
    });

    describe('functions', () => {
        describe('$onInit', () => {
            beforeEach(() => {
                ctrl.map = {
                    setCenter: () => {},
                    setZoom: () => {},
                    getObjects: () => {},
                    removeObject: () => {},
                    addObjects: () => {},
                    setViewBounds: () => {}
                }
                spyOn(ctrl.map, 'setCenter');
                spyOn(ctrl.map, 'setZoom');
                spyOn(ctrl.map, 'getObjects').and.returnValue([1, 2]);
                spyOn(ctrl.map, 'removeObject');
                spyOn(ctrl.map, 'addObjects');
                spyOn(ctrl.map, 'setViewBounds');
                spyOn(PositionService, 'getPosition').and.returnValue({
                    Latitude: '1',
                    Longitude: '2'
                });
                spyOn(window.H.geo, 'Strip').and.returnValue({
                    pushLatLngAlt: () => {}
                });
                spyOn(window.H.map, 'Polyline').and.returnValue({
                    getBounds: () => {}
                });
            })
            it('selected.position.updated listener', () => {
                ctrl.$onInit();
                $rootScope.$broadcast('selected.position.updated');
                expect(PositionService.getPosition).toHaveBeenCalled();
                expect(ctrl.map.setCenter).toHaveBeenCalledWith({lat: '1', lng: '2'}, true);
                expect(ctrl.map.setZoom).toHaveBeenCalledWith(10.5, true);
            });
            it('route.waypoints.updated listener', () => {
                spyOn(RouteService, 'calculateRoute').and.callFake((callback) => {
                    callback({
                        response: {
                            route: [{
                                shape: ['a,b']
                            }]
                        }
                    })
                });
                ctrl.$onInit();
                $rootScope.$broadcast('route.waypoints.updated');
                expect(ctrl.map.getObjects).toHaveBeenCalled();
                expect(ctrl.map.removeObject).toHaveBeenCalled();
                expect(window.H.geo.Strip).toHaveBeenCalled();
                expect(window.H.map.Polyline).toHaveBeenCalledWith(
                    window.H.geo.Strip(), {style: {strokeColor: 'blue', lineWidth: 10}}
                );
                expect(ctrl.map.addObjects).toHaveBeenCalledWith([window.H.map.Polyline()]);
                expect(ctrl.map.addObjects).toHaveBeenCalledWith([jasmine.any(Object)]);
            });
            it('route.waypoints.updated listener, response has no route', () => {
                spyOn(RouteService, 'calculateRoute').and.callFake((callback) => {
                    callback({
                        response: {
                        }
                    })
                });
                ctrl.$onInit();
                $rootScope.$broadcast('route.waypoints.updated');
                expect(ctrl.map.getObjects).not.toHaveBeenCalled();
                expect(ctrl.map.removeObject).not.toHaveBeenCalled();
                expect(window.H.geo.Strip).not.toHaveBeenCalled();
                expect(window.H.map.Polyline).not.toHaveBeenCalledWith(
                    window.H.geo.Strip(), {style: {strokeColor: 'blue', lineWidth: 10}}
                );
                expect(ctrl.map.addObjects).not.toHaveBeenCalledWith([window.H.map.Polyline()]);
                expect(ctrl.map.addObjects).not.toHaveBeenCalledWith([jasmine.any(Object)]);
            });
        });
        it('$postLink', () => {
            ctrl.$postLink();
            expect(ctrl.defaultLayers).toEqual(new FakeLayers());
            expect(ctrl.map).toEqual(new FakeMap());
            expect(ctrl.mapEvents).toEqual(new FakeMapEvents());
            expect(ctrl.behavior).toEqual(new FakeBehavior());
            expect(ctrl.ui).toEqual(undefined);
        });
    });
});