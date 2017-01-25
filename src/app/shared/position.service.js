export default class PositionService {
    constructor($rootScope) {
        this.$rootScope = $rootScope;
        this.state = {
            selectedPosition: {}
        };
    }
    selectPosition(value) {
        this.state.selectedPosition = value;
        this.$rootScope.$broadcast('selected.position.updated', this.state.selectedPosition);
    }
    getPosition() {
        return this.state.selectedPosition;
    }
}

PositionService.$inject = ['$rootScope'];