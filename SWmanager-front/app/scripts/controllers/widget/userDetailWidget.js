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
  .controller('UserDetailWidgetCtrl', function ($scope, User) {

    $scope.initUserDetail = function() {
      $scope.user = User.getPlayer();
    };

    $scope.initUserDetail();
  });
