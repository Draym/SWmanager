/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc function
 * @name SWmanagerApp.controller:HelpPlayerModalCtrl
 * @description
 * # HelpPlayerModalCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('HelpPlayerModalCtrl', function ($scope, $uibModalInstance) {
    $scope.quit = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
