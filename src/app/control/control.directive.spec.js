describe('control:', () => {
    let element, $scope, $rootScope;

    beforeEach(angular.mock.module("app"));

    beforeEach(() => {
        angular.mock.inject((_$compile_, _$rootScope_, $window) => {
            $scope = _$rootScope_.$new();
            $rootScope = _$rootScope_;
            element = angular.element('<control></control>');

            _$compile_(element)($scope);

            $scope.$digest();
        });
    });

    describe('template', () => {
        it('external libs', () => {
        });
    })
});