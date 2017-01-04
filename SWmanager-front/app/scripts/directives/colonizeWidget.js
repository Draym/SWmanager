/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc directive
 * @name SWmanagerApp.directive:colonizeWidget
 * @description
 * # colonizeWidget
 */
angular.module('SWmanagerApp')
  .directive('colonizeWidget', function () {
    return {
      restrict: 'A',
      templateUrl: "views/widget/colonizeWidget.html",
      controller: "ColonizeWidgetCtrl"
    }
  });
