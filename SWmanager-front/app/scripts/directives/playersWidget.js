/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc directive
 * @name SWmanagerApp.directive:playersWidget
 * @description
 * # playersWidget
 */
angular.module('SWmanagerApp')
  .directive('playersWidget', function () {
    return {
      restrict: 'A',
      templateUrl: "views/widget/playersWidget.html",
      controller: "PlayersWidgetCtrl"
    };
  });
