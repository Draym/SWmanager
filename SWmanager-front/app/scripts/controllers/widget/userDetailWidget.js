/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc function
 * @name SWmanagerApp.controller:UserDetailWidgetCtrl
 * @description
 * # UserDetailWidgetCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('UserDetailWidgetCtrl', function ($scope, $location, $uibModal, User, StringUtilsCustom) {

    /*** FUNCTION ***/
    $scope.openCurrentModal = function () {
      var modalInstance = $uibModal.open({
        templateUrl: 'views/modal/currentOperations.html',
        controller: 'CurrentOperationsModalCtrl',
        size: 'lg'
      });
    };

    $scope.openOperations = function() {
      var modalInstance = $uibModal.open({
        templateUrl: 'views/modal/listOperations.html',
        controller: 'ListOperationsModalCtrl',
        size: 'lg'
      });
    };

    $scope.disconnect = function() {
      User.disconnect();
      $scope.user = null;
      $location.path("/login")
    };

    $scope.initUserDetail = function() {
      $scope.user = User.getPlayer();
    };

    $scope.beautyNumber = function (number) {
      return StringUtilsCustom.beautyNumber(number);
    };

    $scope.initUserDetail();
  });
