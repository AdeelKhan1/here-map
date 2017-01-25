export default class MainCtrl {
    constructor($scope, $window, $timeout) {
        this.$scope = $scope;
        this.$window = $window;
        this.$timeout = $timeout;

        this.draw = true;

        angular.element($window).bind('resize', this.onResize.bind(this));
    }
    onResize() {
        let value = this.getWindowDimensions();
        this.mapSize = {
            width: value.w + 'px',
            height: value.h + 'px'
        };
        let timeout = this.$timeout(() => {
            this.$scope.$apply(() => {
                this.draw = !this.draw;
                if (this.draw) {
                    $timeout.cancel(timeout);
                }
            });
        })
    }

    getWindowDimensions() {
        return {
            'h': this.$window.innerHeight,
            'w': this.$window.innerWidth
        };
    }
}

MainCtrl.$inject = ['$scope', '$window', '$timeout'];