/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc function
 * @name SWmanagerApp.controller:PlanetsWidgetCtrl
 * @description
 * # PlanetsWidgetCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('PlanetsWidgetCtrl', function ($scope, $timeout, $uibModal, toaster, SubmitResult, RequestAPI, User, CloneUtilsCustom) {

    $scope.planets = [];
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;

    /*** PAGINATION ***/
    $scope.groupToPages = function () {
      $scope.pagedItems = [];

      for (var i = 0; i < $scope.planets.length; i++) {
        if (i % $scope.itemsPerPage === 0) {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.planets[i]];
        } else {
          $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.planets[i]);
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
    var parseByG = function () {
      if ($scope.currentSelect.G.id != 0) {
        for (var i = 0; i < $scope.planets.length; ++i) {
          if ($scope.planets[i].position.g != $scope.currentSelect.G.id) {
            $scope.planets.splice(i, 1);
            --i;
          }
        }
      }
    };

    var parseByS = function () {
      if ($scope.currentSelect.S.id != 0) {
        for (var i = 0; i < $scope.planets.length; ++i) {
          if (!($scope.planets[i].position.s >= $scope.currentSelect.S.min && $scope.planets[i].position.s <= $scope.currentSelect.S.max)) {
            $scope.planets.splice(i, 1);
            --i;
          }
        }
      }
    };

    $scope.parseUnparsedPlanets = function () {
      $scope.planets = CloneUtilsCustom.cloneArray($scope.unparsedPlanets);

      parseByG();
      parseByS();
      $scope.sortParsedPlanets();
      $scope.groupToPages();
    };

    $scope.sortParsedPlanets = function () {
      $scope.planets.sort(comparePosition);
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
    $scope.loadPlanets = function () {
      RequestAPI.GET("/planet/all", SubmitResult.submitSuccess(function (response) {
          $scope.unparsedPlanets = response.data.planets;
          $scope.unparsedPlanets.sort(comparePosition);
          for (var i = 0; i < $scope.unparsedPlanets.length; ++i) {
            $scope.unparsedPlanets[i].index = i;
          }
          $scope.parseUnparsedPlanets();
          $scope.busy = false;
        }),
        SubmitResult.submitFailure(function () {
          $scope.busy = false;
        }));
    };

    $scope.loadParser = function() {
      $scope.galaxy = [];
      $scope.system = [];
      $scope.currentSelect = {};

      $scope.galaxy.push({name: "All Galaxy", id: 0});
      for (var i = 1; i <= 6; ++i) {
        $scope.galaxy.push({name: "Galaxy_"+i, id: i});
      }
      $scope.currentSelect.G = $scope.galaxy[0];

      var min = 0;
      var max = 100;

      $scope.system.push({name: "All System", id: 0, min: 0, max: 0});
      for (var i2 = 0; i2 < 5; ++i2) {
        $scope.system.push({
          min: min,
          max: max,
          id: i2 + 1,
          name: "System " + min + " -> " + max
        });
        min += 100;
        max += 100;
        max = (max == 500 ? 499 : max);
      }
      $scope.currentSelect.S = $scope.system[0];
    };

    $scope.initPlanets = function () {
      $scope.loadParser();
      $scope.loadPlanets();
    };

    $scope.initPlanets();
  });
