'use strict';

/**
 * @ngdoc service
 * @name SWmanagerApp.requestAPI
 * @description
 * # requestAPI
 * Factory in the SWmanagerApp.
 */
angular.module('SWmanagerApp')
  .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
  }])
  .factory('RequestAPI', function ($http, User) {
    // Service logic
    // ...

    var api_url = '/api';

    function createParametersUrl(parameters) {
      var url = "";

      if (parameters != null && typeof parameters === 'object') {
        url += "?";
        var passed = false;

        angular.forEach(parameters, function (value, key) {
          if (passed) {
            url += "&";
          }
          url += key + "=" + value;
          passed = true;
        });
      }

      return url;
    }

    function updateUser(parameters) {
      if (parameters && parameters.token) {
        User.update(parameters.token);
      }
    }

    function withData(method, url, data, success, failure, parameters) {
      $http({
        method: method,
        url: api_url + url + createParametersUrl(parameters),
        data: data,
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(
        function (response) {
          // success callback
          if (response.data != null && response.data.success == true) {
            success(response);
          } else {
            failure(response);
          }
        },
        function (response) {
          // failure callback
          failure(response);
        }
      );
    }

    function noData(method, url, success, failure, parameters) {
      $http({
        method: method,
        url: api_url + url + createParametersUrl(parameters),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(
        function (response) {
          // success callback
          if (response.data != null && ((response.data.success != null && response.data.success == true) || response.data.success == null)) {
            success(response);
          } else {
            failure(response);
          }
        },
        function (response) {
          // failure callback
          failure(response);
        }
      );
    }

    // Public API here
    return {
      POST: function (url, data, success, failure, parameters) {
        updateUser(parameters);
        withData("POST", url, data, success, failure, parameters);
      },
      GET: function (url, success, failure, parameters) {
        updateUser(parameters);
        noData("GET", url, success, failure, parameters);
      },
      PUT: function (url, data, success, failure, parameters) {
        updateUser(parameters);
        withData("PUT", url, data, success, failure, parameters);
      },
      DELETE: function (url, success, failure, parameters) {
        updateUser(parameters);
        noData("DELETE", url, success, failure, parameters);
      }
    };
  });
