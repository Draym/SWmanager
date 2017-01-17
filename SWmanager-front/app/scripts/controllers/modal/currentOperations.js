/**
 * Created by kevin on 08/01/2017.
 */

/**
 * @ngdoc function
 * @name SWmanagerApp.controller:CurrentOperationsModalCtrl
 * @description
 * # CurrentOperationsModalCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('CurrentOperationsModalCtrl', function ($scope, $timeout, $uibModalInstance, OperationManager) {

    $scope.script = "";
    $scope.currentPage = 0;
    $scope.itemsPerPage = 10;
    $scope.changeName = false;
    $scope.changeDesc = false;

    /*** PAGINATION ***/
    $scope.isInCurrentPage = function (index) {
      return (index >= ($scope.currentPage * $scope.itemsPerPage) && index < ($scope.currentPage * $scope.itemsPerPage) + $scope.itemsPerPage);
    };

    $scope.numberPages = function () {
      return ($scope.currentOperation.ops.length / $scope.itemsPerPage);
    };

    $scope.prevPage = function () {
      if ($scope.currentPage > 0) {
        $scope.currentPage--;
      }
    };

    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.numberPages() - 1) {
        $scope.currentPage++;
      }
    };

    /*** FOCUS MODIFICATION ***/
    $scope.setFocus = function (index) {
      $scope.focused = index
    };

    $scope.saveOp = function (op) {
      OperationManager.updateOpFromCurrent(op);
      $scope.setFocus(-1);
    };

    $scope.removeOp = function (op) {
      OperationManager.removeFromCurrent(op);
      $scope.currentOperation = OperationManager.getCurrent();
    };

    /*** TRANSFORM ***/
    $scope.transformToScript = function () {
      $scope.script = OperationManager.transformCurrent();
    };

    $scope.removeAll = function () {
      OperationManager.clearCurrent();
    };

    $scope.saveCurrent = function () {
      if (!OperationManager.createOperation()) {
        swal({
          title: "An operation exist with the same name",
          text: "add the planets to this operation ?",
          type: "warning",
          showCancelButton: true,
          closeOnConfirm: true,
          closeOnCancel: true,
          confirmButtonColor: "F8BB86",
          cancelButtonText: "No",
          confirmButtonText: "Yes"
        }, function (motif) {
          if (motif === false) return false;
          OperationManager.addOpsToOperation($scope.currentOperation.name, $scope.currentOperation.ops);
          OperationManager.clearCurrent();
          $scope.initCurrentOperation();
        });
      }
      else {
        $scope.initCurrentOperation();
      }
    };

    $scope.updateCurrentConf = function (mode) {
      var value = {};
      if (mode == 1) {
        value.name = $scope.currentOperation.name;
        $scope.changeName = false;
      }
      if (mode == 2) {
        value.description = $scope.currentOperation.description;
        $scope.changeDesc = false;
      }
      OperationManager.updateCurrentConf(value);
    };

    /*** ACTION ***/
    $scope.quit = function () {
      $uibModalInstance.dismiss('cancel');
    };

    /*** INIT ***/
    $scope.initCurrentOperation = function () {
      $scope.currentPage = 0;
      $scope.currentOperation = OperationManager.getCurrent();
    };

    $scope.initCurrentOperation();
  });
