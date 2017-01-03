'use strict';

/**
 * @ngdoc overview
 * @name SWmanagerApp
 * @description
 * # SWmanagerApp
 *
 * Main module of the application.
 */
angular
  .module('SWmanagerApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'toaster',
    'angularFileUpload',
    'selector',
    'angularMoment'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/login', {
        templateUrl: 'views/login/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/createAccount', {
        templateUrl: 'views/account/createAccount.html',
        controller: 'CreateAccountCtrl',
        controllerAs: 'createAccount'
      })
      .when('/myAccount', {
        templateUrl: 'views/account/myAccount.html',
        controller: 'MyAccountCtrl',
        controllerAs: 'myAccount'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
