describe('ControlCtrl', () => {
    let ctrl, $scope, $rootScope, $element, $window, PlatformService, PositionService,
        RouteService, geocodingCallback, placesCallback;
    
    class FakeGeocodingService {
        constructor() {
            this.isFake = true;
        }
        geocode(params, success, error) {
            if (params.a) {
                geocodingCallback = jasmine.createSpy(success).and.callFake(success);
                geocodingCallback(params.a);
            } else {
                geocodingCallback = jasmine.createSpy(error).and.callFake(error);
                geocodingCallback('error');
            }
        }
    }

    class FakePlacesService {
        constructor() {
            this.isFake = true;
        }
        suggest(params, success, error) {
            if (params.q) {
                placesCallback = jasmine.createSpy(success).and.callFake(success);
                placesCallback({suggestions: ['bar', 'baz']});
            } else {
                placesCallback = jasmine.createSpy(error).and.callFake(error);
                placesCallback('error');
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
            $element = angular.element('<div></div>');
            PlatformService = _PlatformService_;
            PositionService = _PositionService_;
            RouteService = _RouteService_;

            spyOn(
                PlatformService.platform, 'getGeocodingService'
            ).and.returnValue(new FakeGeocodingService());
            spyOn(
                PlatformService.platform, 'getPlacesService'
            ).and.returnValue(new FakePlacesService());

            ctrl = _$controller_('ControlCtrl', {
                $scope: $scope,
                $element: $element,
                $window: _$window_,
                PlatformService: PlatformService,
                PositionService: PositionService,
                RouteService: RouteService
            });
        });
    });

    it('has initialized variables', () => {
        expect(ctrl.searchString).toBe('');
        expect(ctrl.searchResults).toEqual([]);
        expect(ctrl.limit).toBe(5);
    });

    describe('functions', () => {
        describe('fetchGeocode', () => {
            beforeEach(() => {
                spyOn(window.console, 'error');
            });
            it('succeeds', () => {
                let callback = () => {};
                let fake = jasmine.createSpy(callback);
                ctrl.fetchGeocode({a: true}, fake);
                expect(geocodingCallback).toHaveBeenCalledWith(true);
                expect(fake).toHaveBeenCalledWith(true);
            });
            it('fails', () => {
                ctrl.fetchGeocode({a: false}, () => {});
                expect(geocodingCallback).toHaveBeenCalledWith('error');
                expect(window.console.error).toHaveBeenCalledWith('error');
            });
        });
        describe('navigate', () => {
            beforeEach(() => {
                spyOn(ctrl, 'fetchGeocode').and.callFake((params, callback) => {
                    callback(true);
                });
                spyOn(PositionService, 'selectPosition');
            });
            it('calls fetchGeocode and passes data to the positionService', () => {
                ctrl.navigate('bloop');
                expect(ctrl.fetchGeocode).toHaveBeenCalledWith({
                    searchtext: 'bloop',
                    gen: '8'
                }, jasmine.any(Function));
                expect(PositionService.selectPosition).toHaveBeenCalledWith(true);
            });
        });
        describe('search', () => {
            beforeEach(() => {
                spyOn(window.console, 'error');
            });
            it('calls the places service and stores data in searchResults', () => {
                ctrl.searchString = 'foo';
                ctrl.search();
                expect(ctrl.searchResults).toEqual(['bar', 'baz']);
            });
            it('calls the places service but fails', () => {
                ctrl.searchString = undefined;
                ctrl.search();
                expect(ctrl.searchResults).toEqual([]);
                expect(window.console.error).toHaveBeenCalledWith('error');
            });
        });
        describe('getWaypointNames', () => {
            it('calls the routeService to get the waypoint names', () => {
                RouteService.names = ['foo', 'bar'];
                expect(ctrl.getWaypointNames()).toEqual(['foo', 'bar']);
            });
        });
        describe('addToWaypoints', () => {
            it('calls the routeService to add a waypoint after fetching the geocode', () => {
                spyOn(ctrl, 'fetchGeocode').and.callFake((params, success) => {
                    success('baz');
                });
                spyOn(RouteService, 'addWaypoint');
                ctrl.addToWaypoints('foo');
                $scope.$apply();
                expect(RouteService.addWaypoint).toHaveBeenCalledWith('baz', 'foo');
            });
        });
        describe('removeWaypoint', () => {
            it('calls the routeService to remove a waypoint', () => {
                spyOn(RouteService, 'removeWaypoint');
                ctrl.removeWaypoint(1);
                expect(RouteService.removeWaypoint).toHaveBeenCalledWith(1);
            });
        });
        describe('setMode', () => {
            it('calls the routeService to set the mode for a route', () => {
                spyOn(RouteService, 'setMode');
                ctrl.setMode('pedestrian');
                expect(RouteService.setMode).toHaveBeenCalledWith('pedestrian');
            });
        });
        describe('allowDrop', () => {
            it('prevents default event behaviour', () => {
                let fakeEvent = {
                    preventDefault: () => {}
                };
                spyOn(fakeEvent, 'preventDefault');
                ctrl.allowDrop(fakeEvent);
                expect(fakeEvent.preventDefault).toHaveBeenCalled();
            });
        });
        describe('drag', () => {
            it('sets data on the event', () => {
                let fakeEvent = {
                    dataTransfer: {
                        setData: () => {}
                    }
                };
                spyOn(fakeEvent.dataTransfer, 'setData');
                ctrl.drag(fakeEvent, 1);
                expect(fakeEvent.dataTransfer.setData).toHaveBeenCalledWith('index', 1);
            });
        });
        describe('drop', () => {
            it('uses the data on the event and calls switchWaypoints with it', () => {
                let fakeEvent = {
                    dataTransfer: {
                        getData: () => 1
                    }
                };
                spyOn(RouteService, 'switchWaypoints');
                spyOn(fakeEvent.dataTransfer, 'getData').and.callThrough();
                ctrl.drop(fakeEvent, 2);
                expect(fakeEvent.dataTransfer.getData).toHaveBeenCalledWith('index');
                expect(RouteService.switchWaypoints).toHaveBeenCalledWith(1, 2);
            });
        });
    });
});