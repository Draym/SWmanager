/**
 * Created by kevin on 04/01/2017.
 */
/**
 * @ngdoc directive
 * @name SWmanagerApp.directive:userDetailWidget
 * @description
 * # userDetailWidget
 */
angular.module('SWmanagerApp')
  .directive('userDetailWidget', function () {
    return {
      restrict: 'A',
      templateUrl: "views/widget/userDetailWidget.html",
      controller: "UserDetailWidgetCtrl"
    };
  });
