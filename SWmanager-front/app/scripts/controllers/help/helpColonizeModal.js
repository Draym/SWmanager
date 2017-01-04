/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc function
 * @name SWmanagerApp.controller:HelpColonizeModalCtrl
 * @description
 * # HelpColonizeModalCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('HelpColonizeModalCtrl', function ($scope, $uibModalInstance) {
    $scope.quit = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
