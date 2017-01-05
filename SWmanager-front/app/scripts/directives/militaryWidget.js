/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc directive
 * @name SWmanagerApp.directive:militaryWidget
 * @description
 * # militaryWidget
 */
angular.module('SWmanagerApp')
  .directive('militaryWidget', function () {
    return {
      restrict: 'A',
      templateUrl: "views/widget/militaryWidget.html",
      controller: "MilitaryWidgetCtrl"
    };
  });
