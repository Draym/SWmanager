/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc function
 * @name SWmanagerApp.controller:PlayerDetailWidgetCtrl
 * @description
 * # PlayerDetailWidgetCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('PlayerDetailModalCtrl', function ($scope, Parent, $uibModalInstance, OperationManager) {

    $scope.quit = function() {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.initPlayerDetail = function() {
      $scope.player = Parent.player;
    };

    $scope.addToCurrent = function() {
      OperationManager.addToCurrent($scope.player.planets);
    };

    $scope.initPlayerDetail();
  });
