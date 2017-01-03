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
        RequestAPI.GET("/player", SubmitResult.submitSuccess(function (response) {
            User.setPlayer(response.data.player);
          }),
          SubmitResult.submitFailure(), {login: User.getLogin()});
      } else {
        $location.path("/login");
      }
    };

    $scope.init();
  });
