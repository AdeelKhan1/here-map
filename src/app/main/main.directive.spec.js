describe('main:', () => {
    let element, $scope, $rootScope, PlatformService;

    class FakeRouter {
        constructor() {
            this.isFake = true;
        }
    }
    class FakePlatform {
        constructor() {
            this.isFake = true;
        }
    }
    class FakeMapEvents {
        constructor() {
            this.isFake = true;
        }
    }
    class FakeDataModel {
        constructor() {
            this.isFake = true;
        }
    }

    beforeEach(angular.mock.module("app"));

    beforeEach(() => {
        angular.mock.inject((_$compile_, _$rootScope_, _PlatformService_) => {
            $scope = _$rootScope_.$new();
            $rootScope = _$rootScope_;
            PlatformService = _PlatformService_;
            element = angular.element('<main></main>');

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
            spyOn(window.H, 'Map');
            spyOn(window.H.map, 'DataModel').and.returnValue(new FakeDataModel());
            spyOn(window.H.ui.UI, 'createDefault');
            spyOn(
                PlatformService.platform, 'createDefaultLayers'
            ).and.returnValue({
                normal: {
                    map: []
                }
            });

            _$compile_(element)($scope);

            $scope.$digest();
        });
    });

    describe('template', () => {
        it('should contain initial values', () => {
            expect(element.find('div')[0].className).toBe('map ng-scope');
            expect(element.find('control').length).toBe(1);
        });
    })
});