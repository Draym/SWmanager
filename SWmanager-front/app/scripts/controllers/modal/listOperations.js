/**
 * Created by kevin on 08/01/2017.
 */

/**
 * @ngdoc function
 * @name SWmanagerApp.controller:ListOperationsModalCtrl
 * @description
 * # ListOperationsModalCtrl
 * Controller of the SWmanagerApp
 */
angular.module('SWmanagerApp')
  .controller('ListOperationsModalCtrl', function ($scope, $timeout, $uibModalInstance, OperationManager, StringUtilsCustom) {
    $scope.script = "";
    $scope.currentPage = 0;
    $scope.itemsPerPage = 10;
    $scope.change = {};
    $scope.change.changeDesc = false;
    $scope.currentOperation = null;

    /*** GETTER ***/

    $scope.getTotalConv = function () {
      var total = 0;

      for (var i = 0; i < $scope.currentOperation.ops.length; ++i) {
        total += $scope.currentOperation.ops[i].nbConv;
      }
      return $scope.beautyNumber(total);
    };

    $scope.getTotalFou = function () {
      var total = 0;

      for (var i = 0; i < $scope.currentOperation.ops.length; ++i) {
        total += $scope.currentOperation.ops[i].nbFou;
      }
      return $scope.beautyNumber(total);
    };

    /*** PAGINATION LIST ***/
    $scope.numberPages = function () {
      return ($scope.listOperations.length / $scope.itemsPerPage);
    };

    /*** PAGINATION OPS ***/
    $scope.numberPages = function () {
      return ($scope.currentOperation.ops.length / $scope.itemsPerPage);
    };

    /*** PAGINATION ***/
    $scope.isInCurrentPage = function (index) {
      return (index >= ($scope.currentPage * $scope.itemsPerPage) && index < ($scope.currentPage * $scope.itemsPerPage) + $scope.itemsPerPage);
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
    /*** PARSING MODIFIER ***/

    $scope.removeOpsFrom = function (operation, source) {
      if (operation.name == "select" || operation.name == source.name) {
        return;
      }
      OperationManager.removeOpsFrom(operation, source);
      $scope.setListOps();
    };

    $scope.addOpsFrom = function (operation, source) {
      console.log($scope.selectAdd || operation.name == source.name)
      if (operation.name == "select") {
        return;
      }
      OperationManager.addOpsFrom(operation, source);
      $scope.setListOps();
    };

    /*** OPERATION LIST ***/
    $scope.setListOps = function () {
      $scope.listOperations = OperationManager.getOperations();
      $scope.listOpsSelect = [{name: "select"}];
      $scope.selectAdd = [];
      $scope.selectRemove = [];

      $scope.selectAdd.push($scope.listOpsSelect[0]);
      $scope.selectRemove.push($scope.listOpsSelect[0]);

      for (var i = 0; i < $scope.listOperations.length; ++i) {
        $scope.listOpsSelect.push($scope.listOperations[i]);
        $scope.selectAdd.push($scope.listOpsSelect[0]);
        $scope.selectRemove.push($scope.listOpsSelect[0]);
      }
    };

    $scope.removeOperation = function (name) {
      OperationManager.removeOperation(name);
      $scope.setListOps();
    };

    $scope.selectOperation = function (operation) {
      $scope.currentOperation = operation;
    };

    $scope.back = function () {
      $scope.setListOps();
      $scope.currentPage = 0;
      $scope.script = "";
      $scope.currentOperation = null;
    };

    /*** FOCUS MODIFICATION ***/
    $scope.setFocus = function (index) {
      $scope.focused = index
    };

    $scope.saveOp = function (op) {
      OperationManager.updateOpFromOperation($scope.currentOperation.name, op);
      $scope.setFocus(-1);
    };

    $scope.removeOp = function (op) {
      OperationManager.removeFromOperation($scope.currentOperation.name, op);
      $scope.currentOperation = OperationManager.getOperation($scope.currentOperation.name)
    };

    /*** TRANSFORM ***/
    $scope.beautyNumber = function (number) {
      return StringUtilsCustom.beautyNumber(number);
    };

    $scope.transformToScript = function () {
      $scope.script = OperationManager.transformOperation($scope.currentOperation.name)
    };

    $scope.removeAll = function () {
      OperationManager.removeOperation($scope.currentOperation.name);
    };

    $scope.updateCurrentConf = function (mode) {
      var value = {};
      if (mode == 1) {
        value.name = $scope.currentOperation.name;
        $scope.changeName = false;
      }
      if (mode == 2) {
        value.description = $scope.currentOperation.description;
        $scope.change.changeDesc = false;
      }
      OperationManager.updateOperationConf($scope.currentOperation.name, value);
    };

    /*** ACTION ***/
    $scope.quit = function () {
      $uibModalInstance.dismiss('cancel');
    };

    /*** INIT ***/
    $scope.initListOperations = function () {
      $scope.listPage = 0;
      $scope.setListOps();
    };

    $scope.initListOperations();
  });
