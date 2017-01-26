describe('AppCtrl', () => {
    let ctrl, $scope, $rootScope, $timeout, $window;

    beforeEach(() => {
        angular.mock.module('app');

        angular.mock.inject((_$controller_, _$rootScope_, _$window_, _$timeout_) => {
            $rootScope = _$rootScope_;
            $window = _$window_;
            $scope = $rootScope.$new();
            $timeout = _$timeout_;

            ctrl = _$controller_('MainCtrl', {
                $scope: $scope,
                $window: _$window_,
                $timeout: $timeout
            });
        });
    });

    it('has initialized variables', () => {
        expect(ctrl.timer).toBe(undefined);
        expect(ctrl.mapSize).toBe(undefined);
        expect(ctrl.draw).toBe(true);
    });

    describe('functions', () => {
        let dimensions = {
            'h': 123,
            'w': 124
        };
        it('onResize', () => {
            spyOn(ctrl, 'getWindowDimensions').and.returnValue(dimensions);
            spyOn($timeout, 'cancel').and.callThrough();

            expect(ctrl.mapSize).toBe(undefined);
            expect(ctrl.draw).toBe(true);

            ctrl.onResize();
            $timeout.flush();
            $rootScope.$apply();

            expect(ctrl.getWindowDimensions).toHaveBeenCalledWith();
            expect(ctrl.draw).toBe(false);

            ctrl.onResize();
            $timeout.flush();
            $rootScope.$apply();

            expect(ctrl.draw).toBe(true);
            expect($timeout.cancel).toHaveBeenCalledWith(jasmine.anything());

            expect(ctrl.mapSize).toEqual({
                width: dimensions.w + 'px',
                height: dimensions.h + 'px'
            });
        });
        it('getWindowDimensions', () => {
            expect(ctrl.getWindowDimensions()).toEqual({
                'h': $window.innerHeight,
                'w': $window.innerWidth
            });
        });
    });
});