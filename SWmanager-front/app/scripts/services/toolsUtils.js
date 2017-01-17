'use strict';

/**
 * @ngdoc service
 * @name SWmanagerApp.toolsUtils
 * @description
 * # toolsUtils
 * Factory in the SWmanagerApp.
 */
angular.module('SWmanagerApp')
  .factory('StringUtilsCustom', function () {
    return {
      ReplaceAll: function (str, find, replace) {
        find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(new RegExp(find, 'g'), replace);
      },
      beautyNumber: function(number) {
        var str = number.toString();
        var count = 0;

        for (var i = str.length - 1; i > 0; --i) {
          ++count;
          if (count == 3) {
            str = str.slice(0, i) +  "." + str.slice(i);
            count = 0;
          }

        }
        return str;
      }
    }
  })
  .factory('DateUtilsCustom', function () {
    return {
      /**
       * @return {boolean}
       */
      IsValid: function (date) {
        if (Object.prototype.toString.call(date) !== "[object Date]")
          return false;
        return !isNaN(date.getTime());
      },
      GetMonday: function (date) {
        date = new Date(date);
        var day = date.getDay(),
          diff = date.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(date.setDate(diff));
      }
    }
  })
  .factory('StorageUtils', function () {
    return {
      read: function(fileName) {
        return localStorage[fileName];
      },
      write: function(fileName, content) {
        localStorage[fileName] = content;
      }
    }
  })
  .factory('CloneUtilsCustom', function () {
    var lightClone = function (object) {
      return jQuery.extend({}, object);
    };
    var cloneObject = function (object) {
      if (object === null) {
        return null;
      }
      var cloned = {};

      angular.forEach(object, function (value, key) {
        if (value === null) {
          cloned[key] = null;
        } else if (Array.isArray(value)) {
          cloned[key] = cloneArray(value);
        } else if (typeof value === 'object') {
          cloned[key] = cloneObject(value);
        } else {
          cloned[key] = value;
        }
      });
      return cloned;
    };
    var cloneArray = function (array) {
      var cloned = [];

      angular.forEach(array, function (value, key) {
        if (Array.isArray(value)) {
          cloned[key] = cloneArray(value);
        } else if (typeof value === 'object') {
          cloned[key] = cloneObject(value);
        } else {
          cloned[key] = value;
        }
      });
      return cloned;

    };
    var copyObject = function (object, target) {
      angular.forEach(object, function (value, key) {
        target[key] = value;
      });
    };
    return {
      copyObject: copyObject,
      cloneObject: cloneObject,
      cloneArray: cloneArray
    };
  })
  .factory('ObjectUtilsCustom', function () {
    return {
      /**
       * @return {boolean}
       */
      objectsAreEquals: function (obj1, obj2) {
        for (var property in obj1) {
          if (!(property in obj2) || obj1[property] != obj2[property]) {
            return false;
          }
        }
        return true;
      },
      /**
       * @return {boolean}
       */
      objectsAreEqualsByFields: function (obj1, obj2, fields) {
        for (var i = 0; i < fields.length; ++i) {
          var property = fields[i];
          if (!(property in obj1) || !(property in obj2) || obj1[property] != obj2[property]) {
            return false;
          }
        }
        return true;
      }
    }

  })
  .factory('ArrayUtilsCustom', function () {
    return {
      /**
       * @return {boolean}
       */
      hasPropertyById: function (tab, value) {
        var id = value;
        if (typeof value === 'object' && typeof value.id != "undefined") {
          id = value.id;
        }
        for (var i = 0; i < tab.length; ++i) {
          if (tab[i].id === id) {
            return true;
          }
        }
        return false;
      },
      /**
       * @return {boolean}
       */
      hasPropertyByNom: function (tab, value) {
        var nom = value;
        if (typeof value === 'object' && typeof value.nom != "undefined") {
          nom = value.nom;
        }
        for (var i = 0; i < tab.length; ++i) {
          if (tab[i].nom === nom) {
            return true;
          }
        }
        return false;
      },
      /**
       * @return {number}
       */
      getPropertyById: function (tab, value) {
        var id = value;
        if (typeof value === 'object' && typeof value.id != "undefined") {
          id = value.id;
        }
        for (var i = 0; i < tab.length; ++i) {
          if (tab[i].id === id) {
            return i;
          }
        }
        return -1;
      },
      /**
       * @return {number}
       */
      countByPropertyEquals: function (tab, property, value) {
        var nbr = 0;

        for (var i = 0; i < tab.length; ++i) {
          angular.forEach(tab[i], function (item, key) {
            if (key === property && tab[i][key] === value) {
              ++nbr;
            }
          });
        }
        return nbr;
      },
      /**
       * @returns {object}
       */
      getByPropertyEquals: function (tab, property, value) {

        for (var i = 0; i < tab.length; ++i) {
          for (var key in tab[i]) {
            if (key === property && tab[i][key] === value) {
              return tab[i];
            }
          }
        }
        return null;
      },
      removeByPropertyEquals: function (tab, property, value) {
        var removed = false;
        for (var i = 0; i < tab.length; ++i) {
          var remove = false;
          for (var key in tab[i]) {
            if (key === property && tab[i][key] === value) {
              remove = true;
              break;
            }
          }
          if (remove) {
            tab.splice(i, 1);
            --i;
            removed = true;
          }
        }
        return removed;
      }
    }
  });
