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

    $scope.init = function () {
      if (User.getLogin() != undefined) {
        if (User.getPlayer() == null) {
          RequestAPI.GET("/player", SubmitResult.submitSuccess(function (response) {
              User.connect(response.data.player);
            }),
            SubmitResult.submitFailure(), {pseudo: User.getLogin()});
        }
      } else {
        $location.path("/login");
      }
    };

    $scope.init();
  });
