/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc function
 * @name SWmanagerApp.controller:HelpMilitaryModalCtrl
 * @description
 * # HelpMilitaryModalCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('HelpMilitaryModalCtrl', function ($scope, $uibModalInstance) {
    $scope.quit = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
