'use strict';

/**
 * @ngdoc function
 * @name SWmanagerApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('LoginCtrl', function ($scope, $location, toaster, RequestAPI, User, SubmitResult) {
    $scope.isBusy = false;
    $scope.info = false;

    $scope.loginPageLocation = function () {
      return $location.path() == "/login";
    };

    $scope.doLogin = function () {
      $scope.isBusy = true;
      RequestAPI.GET("/player",
        SubmitResult.submitSuccess(function (response) {
          User.connect(response.data.player);
          $scope.initUserDetail();
          $location.path("/");
          $scope.isBusy = false;
          $scope.info = false;
        }, "Connected"),
        SubmitResult.submitFailure(function (response) {
          $scope.isBusy = false;
          $scope.info = true;
        }, "Connexion Failed"), {pseudo: $scope.pseudo});
    };

    $scope.init = function () {
    };

    $scope.init();
  });
