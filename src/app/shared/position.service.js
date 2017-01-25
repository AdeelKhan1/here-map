export default class PositionService {
    constructor($rootScope) {
        this.$rootScope = $rootScope;
        this.state = {
            selectedPosition: {}
        };
    }
    selectPosition(result) {
        if (result.Response.View.length) {
            this.state.selectedPosition = result.Response.View[0].Result[0].Location.DisplayPosition;
            this.$rootScope.$broadcast('selected.position.updated', this.state.selectedPosition);
        }
    }
    getPosition() {
        return this.state.selectedPosition;
    }
}

PositionService.$inject = ['$rootScope'];