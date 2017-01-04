/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc function
 * @name SWmanagerApp.controller:ColonizeWidgetCtrl
 * @description
 * # ColonizeWidgetCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('ColonizeWidgetCtrl', function ($scope, $timeout, $uibModal, toaster, SubmitResult, RequestAPI, User, CloneUtilsCustom) {

    $scope.isBusy = false;
    $scope.resultAvailable = false;
    $scope.mode = 0;
    $scope.galaxyLabel = [
      {id: 0, name: "Galaxies"},
      {id: 1, name: "Galaxy 1"},
      {id: 2, name: "Galaxy 2"},
      {id: 3, name: "Galaxy 3"},
      {id: 4, name: "Galaxy 4"},
      {id: 5, name: "Galaxy 5"},
      {id: 6, name: "Galaxy 6"}];
    $scope.choice = {g: $scope.galaxyLabel[0], people: 'null', type: 'null', level: 'null', inactif: 'null'};


    /*** CONFIGURATION CHART ***/
    $scope.chartLabels = [];
    $scope.chartSeries = ['Population percent: ', 'Inactif percent: '];
    $scope.chartData = [[], []];

    $scope.onChartClick = function (points, evt) {
    };
    $scope.datasetOverride = [{yAxisID: 'y-axis-1'}];

    $scope.chartOptions = {
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left'
          }
        ]
      }
    };

    /*** CONFIGURATION POLAR ***/

    $scope.polarLabels = [];
    $scope.polarData = [];
    $scope.polarOptions = {};

    $scope.onPolarClick = function (points, evt) {
    };

    /*** FUNCTIONS ***/

    $scope.openResultAvailable = function() {
      $scope.resultAvailable = !$scope.resultAvailable;
    };

    $scope.openHelp = function () {
      var modalInstance = $uibModal.open({
        templateUrl: 'views/help/helpColonizeModal.html',
        controller: 'HelpColonizeModalCtrl',
        size: 'lg'
      });
    };

    $scope.getChartGalaxy = function (g) {
      if (g > 0) {
        $scope.createDataChartByGalaxy(g);
      } else {
        $scope.createDataChart();
      }
    };

    $scope.isSearchFormValid = function () {
      return $scope.choice.people != null && $scope.choice.people != 'null';
    };

    $scope.doResearch = function () {
      $scope.isBusy = true;
      console.log($scope.choice);
      RequestAPI.GET("/colonize/findBest", SubmitResult.submitSuccess(function (response) {
          $scope.researchPlanets = response.data.planets;
          $scope.resultAvailable = true;
          console.log($scope.researchPlanets);
          $scope.isBusy = false;
        }),
        SubmitResult.submitFailure(function () {
          $scope.isBusy = false;
        }), {
          g: $scope.choice.g.id,
          people: $scope.choice.people,
          type: $scope.choice.type,
          inactif: $scope.choice.inactif,
          level: $scope.choice.level,
          scoreTotal: User.getPlayer().score.total,
          scoreBuilding: User.getPlayer().score.building,
          scoreFleet: User.getPlayer().score.fleet,
          scoreDefense: User.getPlayer().score.defense
        });
    };

    /*** CREATOR ***/

    $scope.createDataChartByGalaxy = function (g) {
      $scope.mode = g;
      $scope.chartData[0].length = 0;
      $scope.chartLabels.length = 0;
      for (var key in $scope.galaxy) {
        if ($scope.galaxy[key].g == g) {
          for (var i = 0; i < $scope.galaxy[key].systems.length; ++i) {
            $scope.chartData[0].push($scope.galaxy[key].systems[i].galaxyPercent);
            $scope.chartData[1].push($scope.galaxy[key].systems[i].galaxyPercentI);
            $scope.chartLabels.push($scope.galaxy[key].systems[i].min + "/" + $scope.galaxy[key].systems[i].max);
          }
        }
      }
    };
    $scope.createDataChart = function () {
      $scope.mode = 0;
      $scope.chartData[0].length = 0;
      $scope.chartLabels.length = 0;
      for (var key in $scope.galaxy) {
        for (var i = 0; i < $scope.galaxy[key].systems.length; ++i) {
          $scope.chartData[0].push($scope.galaxy[key].systems[i].totalPercent);
          $scope.chartData[1].push($scope.galaxy[key].systems[i].totalPercentI);
          $scope.chartLabels.push("(" + $scope.galaxy[key].g + ": " + $scope.galaxy[key].systems[i].min + "/" + $scope.galaxy[key].systems[i].max + ")");
        }
      }
    };

    $scope.createDataPolar = function () {
      $scope.polarData.length = 0;
      $scope.polarLabels.length = 0;
      for (var key in $scope.galaxy) {
        $scope.polarData.push($scope.galaxy[key].percent);
        $scope.polarLabels.push(key)
      }
    };

    /*** LOAD ***/
    $scope.loadPlayers = function () {
      $scope.isBusy = true;
      RequestAPI.GET("/planet/getPop", SubmitResult.submitSuccess(function (response) {
          $scope.galaxy = response.data.pop;
          console.log($scope.galaxy);
          $scope.createDataChart();
          $scope.createDataPolar();
          $scope.isBusy = false;
        }),
        SubmitResult.submitFailure(function () {
          $scope.isBusy = false;
        }));
    };

    $scope.initPlayers = function () {
      $scope.loadPlayers();
    };

    $scope.initPlayers();
  });
