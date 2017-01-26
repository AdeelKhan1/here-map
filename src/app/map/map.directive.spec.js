describe('map:', () => {
    let element, $scope, $rootScope, PlatformService;

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

    beforeEach(angular.mock.module("app"));

    beforeEach(() => {
        angular.mock.inject((_$compile_, _$rootScope_, $window, _PlatformService_) => {
            $scope = _$rootScope_.$new();
            $rootScope = _$rootScope_;
            PlatformService = _PlatformService_;
            element = angular.element('<map></map>');

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
            spyOn(window.H.mapevents, 'Behavior');
            spyOn(window.H.ui.UI, 'createDefault');
            spyOn(window.H.map, 'DataModel').and.returnValue(new FakeDataModel());
            spyOn(window.H, 'Map').and.returnValue(new FakeMap());
            spyOn(
                PlatformService.platform, 'createDefaultLayers'
            ).and.returnValue(new FakeLayers());

            _$compile_(element)($scope);

            $scope.$digest();
        });
    });

    describe('template', () => {
        it('nothing in the template', () => {
        });
    })
});