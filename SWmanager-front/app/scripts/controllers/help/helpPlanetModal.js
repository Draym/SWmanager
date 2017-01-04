/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc function
 * @name SWmanagerApp.controller:HelpPlanetModalCtrl
 * @description
 * # HelpPlanetModalCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('HelpPlanetModalCtrl', function ($scope, $uibModalInstance) {
    $scope.quit = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
