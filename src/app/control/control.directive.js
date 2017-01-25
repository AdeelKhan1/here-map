import './control.css';

let control = () => {
  return {
    template: require('./control.html'),
    controller: 'ControlCtrl',
    controllerAs: 'control'
  }
};

export default control;