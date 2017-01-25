export default class MainCtrl {
    constructor($scope, $window, $timeout) {
        this.timer;

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
        this.timer = this.$timeout(() => {
            this.$scope.$apply(() => {
                this.draw = !this.draw;
                if (this.draw) {
                    this.$timeout.cancel(this.timer);
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