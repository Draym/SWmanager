'use strict';

/**
 * @ngdoc function
 * @name SWmanagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('AboutCtrl', function ($scope, $cookies) {

    $(document).ready(function() {
      $('#Carousel').carousel({
        interval: 5000
      })
    });

    $scope.removeCookies = function () {
      $cookies.remove("userConnected");
      $cookies.remove("token")
    };
  });
