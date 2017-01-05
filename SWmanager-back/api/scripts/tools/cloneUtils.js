/**
 * Created by kevin on 05/01/2017.
 */

/*** CLONE ***/

function cloneObject(object) {
    if (object === null) {
        return null;
    }
    var cloned = {};

    for (var key in object) {
        var value = object[key];
        if (value === null) {
            cloned[key] = null;
        } else if (Array.isArray(value)) {
            cloned[key] = cloneArray(value);
        } else if (typeof value === 'object') {
            cloned[key] = cloneObject(value);
        } else {
            cloned[key] = value;
        }
    }
    return cloned;
}

function cloneArray(array) {
    var cloned = [];

    for (var key in array) {
        var value = array[key];
        if (Array.isArray(value)) {
            cloned[key] = cloneArray(value);
        } else if (typeof value === 'object') {
            cloned[key] = cloneObject(value);
        } else {
            cloned[key] = value;
        }
    }
    return cloned;
}

exports.cloneObject = function (object) {
    return cloneObject(object);
};

exports.cloneArray = function (array) {
    return cloneArray(array);
};

exports.copyObject = function (object, target) {
    for (var key in object) {
        target[key] = object[key];
    }
};