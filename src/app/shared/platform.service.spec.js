describe('PlatformService:', () => {
    let platformService;
    class FakePlatform {
        constructor() {
            this.isFake = true;
        }
    }

    beforeEach(angular.mock.module("app"));

    beforeEach(angular.mock.inject((_PlatformService_) => {
        platformService = _PlatformService_;
        spyOn(window.H.service, 'Platform').and.returnValue(new FakePlatform());
    }));

    it('initializes, on init', () => {
        platformService.init();
        expect(window.H.service.Platform).toHaveBeenCalledWith({
            'app_id': 'rjavUTHi8Ro5SdWrQDHf',
            'app_code': 'b9naScHzM-oPSs6SopEtIw',
            'useHTTPS': true 
        });
        expect(platformService.platform).toEqual(new FakePlatform());
    });
});