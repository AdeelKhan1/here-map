describe('PositionService:', () => {
    let $rootScope, positionService, result;

    beforeEach(angular.mock.module("app"));

    beforeEach(angular.mock.inject((_$rootScope_, _PositionService_) => {
        $rootScope = _$rootScope_;
        positionService = _PositionService_;
        result = {'Response': {'View': [{'Result': [{'Location': {'DisplayPosition': {
            'h': 1,'w': 2
        }}}]}]}};
        spyOn($rootScope, '$broadcast');
    }));

    it('initializes', () => {
        expect(positionService.state).toEqual({
            selectedPosition: {}
        });
    });

    describe('functions', () => {
        describe('selectPosition', () => {
            it('sets selectedPosition if a View exists, also broadcasts', () => {
                positionService.selectPosition(result);
                expect(positionService.state.selectedPosition).toEqual(
                    result.Response.View[0].Result[0].Location.DisplayPosition
                );
                expect($rootScope.$broadcast).toHaveBeenCalledWith(
                    'selected.position.updated', positionService.state.selectedPosition
                );
            });
            it('selectedPosition isnt set due to View not existing, does not broadcast', () => {
                let noView = result;
                noView.Response.View = [];
                positionService.selectPosition(noView);
                expect(positionService.state.selectedPosition).toEqual({});
                expect($rootScope.$broadcast).not.toHaveBeenCalled();
            });
        });
        describe('getPosition', () => {
            it('returns the value of selectedPosition', () => {
                expect(positionService.getPosition()).toEqual({});
                positionService.selectPosition(result);
                expect(positionService.getPosition()).toEqual(
                    result.Response.View[0].Result[0].Location.DisplayPosition
                );
            });
        });
    });
});