/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc directive
 * @name SWmanagerApp.directive:colonialWidget
 * @description
 * # colonialWidget
 */
angular.module('SWmanagerApp')
  .directive('colonialWidget', function () {
    return {
      restrict: 'A',
      templateUrl: "views/widget/colonialWidget.html",
      controller: "ColonialWidgetCtrl"
    }
  });
