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
  .controller('PlayersWidgetCtrl', function ($scope, $timeout, $uibModal, toaster, SubmitResult, RequestAPI, User, CloneUtilsCustom, StringUtilsCustom) {

    $scope.isBusy = false;
    $scope.sortByPseudoASC = false;
    $scope.sortByPseudoDESC = false;
    $scope.actifMode = true;
    $scope.players = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.currentSortScore = "total";
    $scope.sortScore = ["total", "fleet", "building", "defense"];
    $scope.sortByScoreMode = true;

    $scope.beautyNumber = function (number) {
      return StringUtilsCustom.beautyNumber(number);
    };

    /*** PAGINATION ***/
    $scope.groupToPages = function () {
      $scope.pagedItems = [];

      for (var i = 0; i < $scope.players.length; i++) {
        if (i % $scope.itemsPerPage === 0) {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.players[i]];
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
      return ret;
    };

    $scope.lastPage = function () {
      return $scope.currentPage == $scope.pagedItems.length - 1
    };

    $scope.firstPage = function () {
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

    /*** COMPARATOR ***/
    function comparePseudoASC(player1, player2) {
      return player1.pseudo > player2.pseudo;
    }

    function comparePseudoDESC(player1, player2) {
      return player1.pseudo < player2.pseudo;
    }

    function compareScoreTotal(player1, player2) {
      if (!player1.score.total) {
        return true;
      } else if (!player2.score.total) {
        return false;
      }
      return player1.score.total < player2.score.total;
    }

    function compareScoreBuilding(player1, player2) {
      if (!player1.score.building) {
        return true;
      } else if (!player2.score.building) {
        return false;
      }
      return player1.score.building < player2.score.building;
    }

    function compareScoreFleet(player1, player2) {
      if (!player1.score.fleet) {
        return true;
      } else if (!player2.score.fleet) {
        return false;
      }
      return player1.score.fleet < player2.score.fleet;
    }

    function compareScoreDefense(player1, player2) {
      if (!player1.score.defense) {
        return true;
      } else if (!player2.score.defense) {
        return false;
      }
      return player1.score.defense < player2.score.defense;
    }

    /*** PARSER ***/
    var parseByPseudo = function () {
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
      $scope.currentPage = 0;
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
      } else if ($scope.currentSortScore == "fleet") {
        $scope.players.sort(compareScoreFleet);
      } else if ($scope.currentSortScore == "building") {
        $scope.players.sort(compareScoreBuilding);
      } else if ($scope.currentSortScore == "defense") {
        $scope.players.sort(compareScoreDefense);
      } else {
        $scope.players.sort(compareScoreTotal);
      }
    };

    /*** FUNCTION ***/

    $scope.changeActifMode = function (mode) {
      $scope.actifMode = mode;
      $scope.initPlayers();
    };

    $scope.detailPlayer = function (player) {
      var modalInstance = $uibModal.open({
        templateUrl: 'views/modal/playerDetailModal.html',
        controller: 'PlayerDetailModalCtrl',
        size: 'lg',
        resolve: {
          Parent: function () {
            return {player: player};
          }
        }
      });
    };

    $scope.openHelp = function () {
      var modalInstance = $uibModal.open({
        templateUrl: 'views/help/helpPlayerModal.html',
        controller: 'HelpPlayerModalCtrl',
        size: 'lg'
      });
    };

    $scope.sortByScore = function () {
      $scope.sortByPseudoDESC = false;
      $scope.sortByPseudoASC = false;
      $scope.sortByScoreMode = true;
      $scope.parseUnparsedPlayers();
    };

    $scope.sortByASC = function () {
      $scope.sortByPseudoASC = true;
      $scope.sortByPseudoDESC = false;
      $scope.sortByScoreMode = false;
      $scope.parseUnparsedPlayers();
    };

    $scope.sortByDESC = function () {
      $scope.sortByPseudoASC = false;
      $scope.sortByPseudoDESC = true;
      $scope.sortByScoreMode = false;
      $scope.parseUnparsedPlayers();
    };

    /*** LOAD ***/
    $scope.loadPlayers = function () {
      $scope.isBusy = true;
      RequestAPI.GET("/player/all", SubmitResult.submitSuccess(function (response) {
          $scope.unparsedPlayers = [];

          for (var i = 0; i < response.data.players.length; ++i) {
            if (response.data.players[i].bot != $scope.actifMode) {
              $scope.unparsedPlayers.push(response.data.players[i]);
            }
          }
          $scope.unparsedPlayers.sort(compareScoreTotal);
          for (var i = 0; i < $scope.unparsedPlayers.length; ++i) {
            $scope.unparsedPlayers[i].index = i;
          }
          $scope.parseUnparsedPlayers();
          $scope.isBusy = false;
        }),
        SubmitResult.submitFailure(function () {
          $scope.isBusy = false;
        }));
    };

    $scope.initPlayers = function () {
      $scope.currentPage = 0;
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
        if ($scope.searchPlayer == null) {
          return;
        }
        $scope.parseUnparsedPlayers();
      }, tempo); // delay in ms
    })
  });
