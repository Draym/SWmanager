/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc function
 * @name SWmanagerApp.controller:ColonialWidgetCtrl
 * @description
 * # ColonialWidgetCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('ColonialWidgetCtrl', function ($scope, $timeout, $uibModal, toaster, SubmitResult, RequestAPI, User, CloneUtilsCustom) {

    $scope.mode = 0;
    $scope.labelTitle = ["Galaxies", "Galaxy 1", "Galaxy 2", "Galaxy 3", "Galaxy 4", "Galaxy 5", "Galaxy 6"];

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

    $scope.getChartGalaxy = function(g) {
      if (g > 0) {
        $scope.createDataChartByGalaxy(g);
      } else {
        $scope.createDataChart();
      }
    };

    /*** CREATOR ***/

    $scope.createDataChartByGalaxy = function (g) {
      $scope.mode = g;
      $scope.chartData[0].length = 0;
      $scope.chartLabels.length = 0;
      console.log("neeew")
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
      RequestAPI.GET("/planet/getPop", SubmitResult.submitSuccess(function (response) {
          $scope.galaxy = response.data.pop;
        console.log($scope.galaxy);
          $scope.createDataChart();
          $scope.createDataPolar();
          $scope.busy = false;
        }),
        SubmitResult.submitFailure(function () {
          $scope.busy = false;
        }));
    };

    $scope.initPlayers = function () {
      $scope.loadPlayers();
    };

    $scope.initPlayers();
  });
