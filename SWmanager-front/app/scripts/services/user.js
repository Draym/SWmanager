'use strict';

/**
 * @ngdoc service
 * @name SWmanagerApp.user
 * @description
 * # user
 * Factory in the SWmanagerApp.
 */
angular.module('SWmanagerApp')
  .factory('User', function ($cookies, DateTools) {
    // Service logic
    var idPlayerLogin = "playerLogin";
    var timeOut = 360;
    var player = null;

    var init = function () {
      var token = $cookies.get(idPlayerLogin);
      console.log(token);
      (token == null ? disconnect() : connect());
    };

    function connect(user) {
      player = user;
      $cookies.put(idPlayerLogin, user.pseudo, {
        expires: DateTools.addMinutesToCurrentDate(timeOut)
      });
    }

    function update() {
      var playerLogin = $cookies.get(idPlayerLogin);

      if (playerLogin) {
        connect(playerLogin);
      }
    }

    function disconnect() {
      $cookies.remove(idPlayerLogin);
    }

    // Public API here
    return {
      getLogin: function () {
        return $cookies.get(idPlayerLogin);
      },
      getPlayer : function() {
        return player;
      },
      update: function () {
        update();
      },
      isConnected: function () {
        var id = $cookies.get(idPlayerLogin);

        if (id == null) {
          init();
          id = false;
        }
        return id;
      },
      connect: function (player) {
        connect(player);
      },
      disconnect: function () {
        disconnect();
      }
    };
  });
