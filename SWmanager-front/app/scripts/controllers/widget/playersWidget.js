/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc function
 * @name SWmanagerApp.controller:PlayersWidgetCtrl
 * @description
 * # PlayersWidgetCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('PlayersWidgetCtrl', function ($scope, $timeout, $uibModal, toaster, SubmitResult, RequestAPI, User, CloneUtilsCustom) {

    $scope.sortByScore = true;
    $scope.sortByPseudoASC = false;
    $scope.sortByPseudoDESC = false;
    $scope.players = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;

    // calculate page in place
    $scope.groupToPages = function () {
      $scope.pagedItems = [];

      for (var i = 0; i < $scope.players.length; i++) {
        if (i % $scope.itemsPerPage === 0) {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.players[i] ];
        } else {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.players[i]);
        }
      }
    };

    $scope.range = function (start, end) {
      var ret = [];
      var max = 3;

      if (start + max > end) {
        start = end - max;
      }
      if (start > (end / 2)) {
        ret.push(-1);
      }
      for (var i = 0; i < max; i++) {
          ret.push(start + i);
      }
      if (start < (end / 2)) {
        ret.push(-2);
      }
      console.log(ret);
      return ret;
    };

    $scope.lastPage = function() {
      return $scope.currentPage == $scope.pagedItems.length - 1
    };

    $scope.firstPage = function() {
      return $scope.currentPage == 0;
    };

    $scope.prevPage = function () {
      if ($scope.currentPage > 0) {
        $scope.currentPage--;
      }
    };

    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.pagedItems.length - 1) {
        $scope.currentPage++;
      }
    };

    $scope.setPage = function (val) {
      if (val < 0) {
        val = (val == -1 ? 0 : $scope.pagedItems.length - 1);
      }
      $scope.currentPage = val;
    };

    function comparePseudoASC(player1, player2) {
      return player1.pseudo > player2.pseudo;
    }
    function comparePseudoDESC(player1, player2) {
      return player1.pseudo < player2.pseudo;
    }

    function compareScore(player1, player2) {
      return player1.score.total < player2.score.total;
    }

    var parseByPseudo = function() {
      if ($scope.searchPlayer && $scope.searchPlayer != "") {
        for (var i = 0; i < $scope.players.length; ++i) {
          if (!$scope.players[i].pseudo.toLowerCase().includes($scope.searchPlayer.toLowerCase())) {
            $scope.players.splice(i, 1);
            --i;
          }
        }
      }
    };

    $scope.parseUnparsedPlayers = function () {
      $scope.players = CloneUtilsCustom.cloneArray($scope.unparsedPlayers);

      parseByPseudo();
      $scope.sortParsedPlayers();
      $scope.groupToPages();
    };

    $scope.sortParsedPlayers = function () {
      if ($scope.sortByPseudoASC) {
        $scope.players.sort(comparePseudoASC);
      } else if ($scope.sortByPseudoDESC) {
        $scope.players.sort(comparePseudoDESC);
      } else if ($scope.sortByScore) {
        $scope.players.sort(compareScore);
      }
      for (var i = 0; i < $scope.players.length; ++i) {
        $scope.players[i].index = i;
      }
    };

    /** FUNCTION **/

    $scope.detailPlayer = function (player) {
      var modalInstance = $uibModal.open({
        templateUrl: 'views/modal/detailPlayerModal.html',
        controller: 'DetailPlayerModalCtrl',
        size: 'lg',
        resolve: {
          Parent: function () {
            return {player: player};
          }
        }
      });
    };

    /** LOAD **/
    $scope.loadPlayers = function () {
      RequestAPI.GET("/player/all", SubmitResult.submitSuccess(function (response) {
          $scope.unparsedPlayers = response.data.players;
          $scope.parseUnparsedPlayers();
          $scope.busy = false;
        }),
        SubmitResult.submitFailure(function () {
        }));
    };

    $scope.initPlayers = function () {
      $scope.loadPlayers();
    };

    $scope.initPlayers();

    // Instantiate these variables outside the watch
    var tempo = 400;
    var tempFilterText = '',
      filterTextTimeout;

    $scope.$watch('searchPlayer', function (val) {
      if (filterTextTimeout) {
        $timeout.cancel(filterTextTimeout);
      }
      tempFilterText = val;
      filterTextTimeout = $timeout(function () {
        console.log("'", $scope.searchPlayer);
        if ($scope.searchPlayer == null) {
          return;
        }
        console.log("parse")
        $scope.parseUnparsedPlayers();
      }, tempo); // delay in ms
    })
  });
