/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc function
 * @name SWmanagerApp.controller:MilitaryWidgetCtrl
 * @description
 * # MilitaryWidgetCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('MilitaryWidgetCtrl', function ($scope, $timeout, $uibModal, toaster, SubmitResult, RequestAPI, User, CloneUtilsCustom, OperationManager) {

    $scope.isBusy = false;
    $scope.resultAvailable = false;
    $scope.mode = 0;

    $scope.choice = {planet: null, type: 'null', level: 'null', inactif: 'null', minDist: 0, maxDist: null};

    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;

    /*** PAGINATION ***/
    $scope.groupToPages = function () {
      $scope.pagedItems = [];
      $scope.currentPage = 0;

      for (var i = 0; i < $scope.extractedPlanets.length; i++) {
        if (i % $scope.itemsPerPage === 0) {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.extractedPlanets[i]];
        } else {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.extractedPlanets[i]);
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
    function comparePosition(planet1, planet2) {
      if (planet1.position.g == planet2.position.g) {
        if (planet1.position.s == planet2.position.s) {
          return planet1.position.p > planet2.position.p;
        } else {
          return planet1.position.s > planet2.position.s;
        }
      } else {
        return planet1.position.g > planet2.position.g;
      }
    }

    /*** PARSER ***/
    $scope.parseExtractedPlanets = function () {
      $scope.extractedPlanets = CloneUtilsCustom.cloneArray($scope.researchPlanets.planets);

      $scope.sortParsedPlanets();
      $scope.groupToPages();
    };

    $scope.sortParsedPlanets = function () {
      $scope.extractedPlanets.sort(comparePosition);
    };

    /*** FUNCTIONS ***/

    $scope.addToCurrent = function() {
      var values = [];

      for (var i = 0; i < $scope.extractedPlanets.length; ++i) {
        values.push($scope.extractedPlanets[i].position);
      }
      OperationManager.addToCurrent(values);
    };

    $scope.openResultAvailable = function () {
      $scope.resultAvailable = !$scope.resultAvailable;
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
        templateUrl: 'views/help/helpMilitaryModal.html',
        controller: 'HelpMilitaryModalCtrl',
        size: 'lg'
      });
    };

    $scope.isSearchFormValid = function () {
      return $scope.choice.planet != null && $scope.choice.planet != 'null'
        && $scope.choice.minDist != null && $scope.choice.maxDist != null
        && $scope.choice.minDist >= 0 && $scope.choice.maxDist > 0;
    };

    $scope.doResearch = function () {
      $scope.isBusy = true;
      RequestAPI.GET("/military/findBestTargets", SubmitResult.submitSuccess(function (response) {
          $scope.researchPlanets = response.data.planets;
          $scope.resultAvailable = true;
          $scope.parseExtractedPlanets();
          $scope.isBusy = false;
        }),
        SubmitResult.submitFailure(function () {
          $scope.isBusy = false;
        }), {
          type: $scope.choice.type,
          inactif: $scope.choice.inactif,
          level: $scope.choice.level,
          planetId: $scope.choice.planet.full,
          minDist: $scope.choice.minDist,
          maxDist: $scope.choice.maxDist,
          scoreTotal: User.getPlayer().score.total,
          scoreBuilding: User.getPlayer().score.building,
          scoreFleet: User.getPlayer().score.fleet,
          scoreDefense: User.getPlayer().score.defense
        });
    };

    /*** LOAD ***/
    $scope.loadMilitary = function () {
      $scope.user = User.getPlayer();
    };

    $scope.initMilitary = function () {
      $scope.loadMilitary();
    };

    $scope.initMilitary();
  });
