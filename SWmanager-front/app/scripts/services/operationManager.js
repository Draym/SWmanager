/**
 * Created by kevin on 08/01/2017.
 */
'use strict';

/**
 * @ngdoc service
 * @name SWmanagerApp.operationManager
 * @description
 * # operationManager
 * Factory in the SWmanagerApp.
 */
angular.module('SWmanagerApp')
  .factory('OperationManager', function (StorageUtils) {

    var current = {name: "unknown", ops: []};
    var operations = [];
    var needInit = true;
    var currentOpFile = "currentOp.json";
    var operationsFile = "operations.json";

    /*** ACCESS **/
    function planetInCurrent(planet) {
      for (var i = 0; i < current.ops.length; ++i) {
        if (current.ops[i].planet.full == planet.full) {
          return i;
        }
      }
      return -1;
    }

    function planetInOperations(name, op) {
      for (var i = 0; i < operations.length; ++i) {
        if (operations[i].name == name) {
          for (var i2 = 0; i2 < operations[i].ops.length; ++i2) {
            if (operations[i].ops[i2].planet.full == op.planet.full) {
              return [i, i2];
            }
          }
        }
      }
      return null;
    }

    function operationInOperations(name) {
      for (var i = 0; i < operations.length; ++i) {
        if (operations[i].name == name) {
          return i;
        }
      }
      return -1;
    }

    /*** INIT ***/

    function resetCurrent() {
      current = {name: "unknown", description: "", ops: []};
      saveCurrent();
    }

    function initCurrent() {
      if (needInit) {
        var value = StorageUtils.read(currentOpFile);
        console.log(value);
        if (value) {
          current = JSON.parse(value);
        }
      }
    }

    function initOperations() {
      if (needInit) {
        var value = StorageUtils.read(operationsFile);
        console.log(value);
        if (value) {
          operations = JSON.parse(value);
        }
      }
    }

    function init() {
      if (needInit) {
        initCurrent();
        initOperations();
        needInit = false;
      }
    }

    function compareName(op1, op2) {
      return op1.name > op2.name;
    }

    function comparePosition(op1, op2) {
      if (op1.planet.g == op2.planet.g) {
        if (op1.planet.s == op2.planet.s) {
          return op1.planet.p > op2.planet.p;
        } else {
          return op1.planet.s > op2.planet.s;
        }
      } else {
        return op1.planet.g > op2.planet.g;
      }
    }

    function saveOperations() {
      operations.sort(compareName);
      for (var i = 0; i < operations.length; ++i) {
        operations[i].ops.sort(comparePosition);
      }
      StorageUtils.write(operationsFile, JSON.stringify(operations));
    }

    function saveCurrent() {
      current.ops.sort(comparePosition);
      StorageUtils.write(currentOpFile, JSON.stringify(current));
    }

    /*** CURRENT MODIFIER **/
    function addToCurrent(planets) {
      for (var i = 0; i < planets.length; ++i) {
        if (planetInCurrent(planets[i]) == -1) {
          current.ops.push({planet: planets[i], nbSonde: 0, nbFou: 0, nbConv: 0, description: ""});
        }
      }
      saveCurrent();
    }

    function updateOpFromCurrent(op) {
      var pos = planetInCurrent(op.planet);
      if (pos != -1) {
        current.ops[pos] = op;
      }
      saveCurrent();
    }

    function removeFromCurrent(op) {
      var pos = planetInCurrent(op.planet);
      if (pos != -1) {
        current.ops.splice(pos, 1);
      }
      saveCurrent();
    }

    /*** OPERATIONS MODIFIER ***/
    function saveCurrentToOperations() {
      var pos = operationInOperations(current.name);

      if (pos == -1) {
        operations.push(current);
        resetCurrent();
        saveOperations();
        return true;
      } else {
        return false;
      }
    }

    function removeOpsFrom(operation, source) {
      for (var i = 0; i < source.ops.length; ++i) {
        removeFromOperation(operation.name, source.ops[i]);
      }
    }

    function addOpsFrom(operation, source) {
      addOpsToOperation(operation.name, source.ops);
    }

    function removeOperation(name) {
      var pos = operationInOperations(name);
      if (pos != -1) {
        operations.splice(pos, 1);
        saveOperations();
      }
    }

    function removeFromOperation(name, op) {
      var pos = planetInOperations(name, op);

      if (pos != null) {
        operations[pos[0]].ops.splice(pos[1], 1);
        saveOperations();
      }
    }

    function updateOpFromOperation(name, op) {
      var pos = planetInOperations(name, op);

      if (pos != null) {
        operations[pos[0]].ops[pos[1]] = op;
      }
      saveOperations();
    }

    function addOpsToOperation(name, ops) {
      var pos = operationInOperations(name);

      if (pos != -1) {
        for (var i = 0; i < ops.length; ++i) {
          if (planetInOperations(name, ops[i]) == null) {
            operations[pos].ops.push(ops[i]);
          }
        }
        saveOperations();
      }
    }

    /*** JSON CORRECTOR ***/

    function correctResult(result) {
      return result.replace(/"/gi, "").replace(/,/gi, ";").replace(/:/gi, "=");
    }

    /*** FUNCTION JOB ***/
    function transformPlanetOp(result, op, index) {
      var item = {
        pos1: op.planet.g,
        pos2: op.planet.s,
        pos3: op.planet.p,
        nbSonde: op.nbSonde,
        nbConv: op.nbConv,
        nbFou: op.nbFou
      };
      result += "\n";
      result += (index == 0 ? "if (i == 0)" : "else if (i == " + index + ")");
      result += JSON.stringify(item);
      return result;
    }

    function transformOperation(name) {
      var pos = operationInOperations(name);
      var result = "";

      if (pos != -1) {
        var op = operations[pos];

        for (var i = 0; i < op.ops.length; ++i) {
          result = transformPlanetOp(result, op.ops[i], i);
        }
      }
      return correctResult(result);
    }

    function transformCurrent() {
      var result = "";

      for (var i = 0; i < current.ops.length; ++i) {
        result = transformPlanetOp(result, current.ops[i], i);
      }
      return correctResult(result);
    }

    /*** API ***/
    return {
      getCurrent: function () {
        init();
        return current;
      },
      getOperation: function (name) {
        init();
        var pos = operationInOperations(name);
        if (pos != -1) {
          return operations[pos];
        }
        return null;
      },
      getOperations: function () {
        init();
        return operations;
      },
      init: function () {
        init();
      },
      /** OPERATIONS **/
      removeOpsFrom: function (operation, source) {
        removeOpsFrom(operation, source);
      },
      addOpsFrom: function (operation, source) {
        addOpsFrom(operation, source);
      },
      transformOperation: function (name) {
        init();
        return transformOperation(name);
      },
      updateOpFromOperation: function (name, op) {
        updateOpFromOperation(name, op);
      },
      removeFromOperation: function (name, op) {
        init();
        removeFromOperation(name, op);
      },
      addOpsToOperation: function (name, ops) {
        init();
        addOpsToOperation(name, ops);
      },
      createOperation: function () {
        init();
        return saveCurrentToOperations();
      },
      removeOperation: function (name) {
        init();
        removeOperation(name);
      },
      updateOperationConf: function (name, currentOp) {
        var pos = operationInOperations(name);

        if (pos != -1) {
          if (currentOp.name) {
            operations[pos].name = currentOp.name;
          }
          if (currentOp.description) {
            operations[pos].description = currentOp.description;
          }
        }
        saveOperations();
      },
      /** CURRENT **/
      transformCurrent: function () {
        init();
        return transformCurrent();
      },
      addToCurrent: function (planets) {
        init();
        addToCurrent(planets);
      },
      removeFromCurrent: function (op) {
        init();
        removeFromCurrent(op);
      },
      updateOpFromCurrent: function (op) {
        init();
        updateOpFromCurrent(op);
      },
      updateCurrentConf: function (currentOp) {
        if (currentOp.name) {
          current.name = currentOp.name;
        }
        if (currentOp.description) {
          current.description = currentOp.description;
        }
        saveCurrent();
      },
      clearCurrent: function () {
        init();
        current.ops.length = 0;
      }
    };
  });
