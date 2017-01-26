describe('RouteService:', () => {
    let $rootScope, platformService, result, routeCallback;

    class FakeRouter {
        constructor() {
            this.isFake = true;
        }
        calculateRoute(params, success, error) {
            if (params.a) {
                routeCallback = jasmine.createSpy(success).and.callFake(success);
                routeCallback(params.a);
            } else {
                routeCallback = jasmine.createSpy(error).and.callFake(error);
                routeCallback('error');
            }
        }
    }

    class FakeMarker {
        constructor() {
            this.isFake = true;
            this.bb = {
                lat: 1,
                lng: 2
            }
        }
    }

    beforeEach(angular.mock.module("app"));

    beforeEach(angular.mock.inject((_$rootScope_, _PlatformService_) => {
        $rootScope = _$rootScope_;
        platformService = _PlatformService_;

        result = {'Response': {'View': [{'Result': [{'Location': {'DisplayPosition': {
            'h': 1,'w': 2
        }}}]}]}};

        platformService.platform = {
            getRoutingService: () => true
        };

        spyOn(FakeRouter.prototype, 'calculateRoute').and.callThrough();
        H.map = {
            Marker: FakeMarker
        };
        spyOn(platformService.platform, 'getRoutingService').and.returnValue(new FakeRouter());
        spyOn($rootScope, '$broadcast');
    }));

    it('initializes', angular.mock.inject((RouteService) => {
        expect(RouteService.mode).toBe('fastest;car');
        expect(RouteService.waypoints).toEqual([]);
        expect(RouteService.names).toEqual([]);
        expect(RouteService.representation).toBe('display');
    }));

    describe('functions', () => {
        describe('setMode', () => {
            it('sets mode and broadcasts', angular.mock.inject((RouteService) => {
                RouteService.setMode('pedestrian');
                expect(RouteService.mode).toBe('fastest;pedestrian');
                expect($rootScope.$broadcast).toHaveBeenCalledWith('route.waypoints.updated');
            }));
        });
        describe('calculateRoute', () => {
            let routeService,
                callback = () => {};
            beforeEach(angular.mock.inject((_RouteService_) => {
                routeService = _RouteService_;
            }));
            it('succeeds', () => {
                spyOn(routeService, 'getParameters').and.returnValue({a: true});
                routeService.calculateRoute(callback);
                expect(FakeRouter.prototype.calculateRoute).toHaveBeenCalled();
                expect(routeCallback).toHaveBeenCalledWith(true);
            });
            it('fails', () => {
                result = {a: false};
                spyOn(routeService, 'getParameters').and.returnValue({a: false});
                spyOn(window.console, 'error');
                routeService.calculateRoute(callback);
                expect(FakeRouter.prototype.calculateRoute).toHaveBeenCalled();
                expect(routeCallback).toHaveBeenCalledWith('error');
                expect(window.console.error).toHaveBeenCalledWith('calculateRoute:', 'error');
            });
        });
        describe('getWaypoints', () => {
            it('returns the waypoints array', angular.mock.inject((RouteService) => {
                RouteService.waypoints = ['foo', 'bar'];
                expect(RouteService.getWaypoints()).toEqual(['foo', 'bar']);
            }));
        });
        describe('getWaypointNames', () => {
            it('returns the names array', angular.mock.inject((RouteService) => {
                RouteService.names = ['foo', 'bar'];
                expect(RouteService.getWaypointNames()).toEqual(['foo', 'bar']);
            }));
        });
        describe('switchWaypoints', () => {
            it(
                'switches the places of two waypoints in the waypoints and names arrays' +
                ' also calls broadcast',
                angular.mock.inject((RouteService) => {
                    RouteService.waypoints = ['foo', 'bar', 'moo'];
                    RouteService.names = ['foo', 'bar', 'moo'];
                    RouteService.switchWaypoints(1, 2);
                    expect(RouteService.waypoints).toEqual(['foo', 'moo', 'bar']);
                    expect(RouteService.names).toEqual(['foo', 'moo', 'bar']);
                    expect($rootScope.$broadcast).toHaveBeenCalledWith('route.waypoints.updated');
                }
            ));
        });
        describe('addWaypoint', () => {
            it(
                'does nothing if there are no Views',
                angular.mock.inject((RouteService) => {
                    result.Response.View = [];
                    RouteService.addWaypoint(result, 'bar');
                    expect(RouteService.waypoints).not.toEqual([new FakeMarker()]);
                    expect(RouteService.names).not.toEqual(['bar']);
                    expect(
                        $rootScope.$broadcast
                    ).not.toHaveBeenCalledWith('route.waypoints.updated');
                }
            ));
            it(
                'adds a new waypoint to waypoints and names, doesnt broadcasts',
                angular.mock.inject((RouteService) => {
                    RouteService.addWaypoint(result, 'bar');
                    expect(RouteService.waypoints).toEqual([new FakeMarker()]);
                    expect(RouteService.names).toEqual(['bar']);
                    expect(
                        $rootScope.$broadcast
                    ).not.toHaveBeenCalledWith('route.waypoints.updated');
                }
            ));
            it(
                'adds a second waypoint to waypoints and names, broadcasts',
                angular.mock.inject((RouteService) => {
                    RouteService.addWaypoint(result, 'bar');
                    RouteService.addWaypoint(result, 'foo');
                    expect(RouteService.waypoints).toEqual([new FakeMarker(), new FakeMarker()]);
                    expect(RouteService.names).toEqual(['bar', 'foo']);
                    expect($rootScope.$broadcast).toHaveBeenCalledWith('route.waypoints.updated');
                }
            ));
        });
        describe('removeWaypoint', () => {
            it(
                'removes a waypoint from waypoints and names, doesnt broadcasts',
                angular.mock.inject((RouteService) => {
                    RouteService.waypoints = [new FakeMarker()];
                    RouteService.names = ['foo'];
                    RouteService.removeWaypoint(0);
                    expect(RouteService.waypoints).toEqual([]);
                    expect(RouteService.names).toEqual([]);
                    expect(
                        $rootScope.$broadcast
                    ).not.toHaveBeenCalledWith('route.waypoints.updated');
                }
            ));
            it(
                'removes a waypoint from waypoints and names, broadcasts, ' +
                'when theres more than 2 left',
                angular.mock.inject((RouteService) => {
                    RouteService.waypoints = [new FakeMarker(), new FakeMarker(), new FakeMarker()];
                    RouteService.names = ['foo', 'bar', 'baz'];
                    RouteService.removeWaypoint(2);
                    expect(RouteService.waypoints).toEqual([new FakeMarker(), new FakeMarker()]);
                    expect(RouteService.names).toEqual(['foo', 'bar']);
                    expect($rootScope.$broadcast).toHaveBeenCalledWith('route.waypoints.updated');
                }
            ));
        });
        describe('getParameters', () => {
            it(
                'returns the parameters for a route',
                angular.mock.inject((RouteService) => {
                    RouteService.waypoints = [new FakeMarker()];
                    expect(RouteService.getParameters()).toEqual({
                        mode: 'fastest;car',
                        representation: 'display',
                        waypoint0: 'geo!1,2'
                    });
                }
            ));
            it(
                'returns the parameters for a route, with more than one marker',
                angular.mock.inject((RouteService) => {
                    RouteService.waypoints = [new FakeMarker(), new FakeMarker(), new FakeMarker()];
                    expect(RouteService.getParameters()).toEqual({
                        mode: 'fastest;car',
                        representation: 'display',
                        waypoint0: 'geo!1,2',
                        waypoint1: 'geo!1,2',
                        waypoint2: 'geo!1,2'
                    });
                }
            ));
        });
        describe('getMarkerGeoString', () => {
            it(
                'returns the position values of a Marker as a geostring',
                angular.mock.inject((RouteService) => {
                    expect(RouteService.getMarkerGeoString(new FakeMarker())).toBe('geo!1,2');
                }
            ));
        });
    });
});