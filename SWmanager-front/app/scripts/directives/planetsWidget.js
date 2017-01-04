/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc directive
 * @name SWmanagerApp.directive:planetsWidget
 * @description
 * # planetsWidget
 */
angular.module('SWmanagerApp')
  .directive('planetsWidget', function () {
    return {
      restrict: 'A',
      templateUrl: "views/widget/planetsWidget.html",
      controller: "PlanetsWidgetCtrl"
    }
  });
