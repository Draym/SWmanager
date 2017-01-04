'use strict';

/**
 * @ngdoc function
 * @name SWmanagerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('AboutCtrl', function ($scope, User) {
    $scope.removeCookies = function () {
      User.disconnect();
    };
  });
