'use strict';

/**
 * @ngdoc directive
 * @name SWmanagerApp.directive:loginNavbarWidget
 * @description
 * # loginNavbarWidget
 */
angular.module('SWmanagerApp')
  .directive('loginNavbarWidget', function () {
    return {
      restrict: 'A',
      templateUrl: "views/login/loginNavbarWidget.html",
      controller: "LoginCtrl"
    }
  });
