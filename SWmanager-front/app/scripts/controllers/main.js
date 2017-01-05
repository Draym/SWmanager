'use strict';

/**
 * @ngdoc function
 * @name SWmanagerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('MainCtrl', function ($scope, $location, RequestAPI, SubmitResult, User) {

    $scope.mode = 0;
    $scope.hover = 0;

    $scope.changeMode = function(value) {
      if ($scope.mode == value) {
        $scope.mode = 0;
      } else {
        $scope.mode = value;
      }
    };

    $scope.init = function () {
      if (User.getLogin() != undefined) {
        if (User.getPlayer() == null) {
          RequestAPI.GET("/player", SubmitResult.submitSuccess(function (response) {
              User.connect(response.data.player);
            $scope.initUserDetail();
            }),
            SubmitResult.submitFailure(), {pseudo: User.getLogin()});
        }
      } else {
        $location.path("/login");
      }
    };

    $scope.init();
  });
