/**
 * Created by kevin on 03/01/2017.
 */

exports.dataToJson = function (value) {
    return JSON.parse(value.replace(/\\/gi, "").slice(1, -1));
};

/*** LOG ***/

exports.colors = {
    FG_BLACK: "\x1b[30m",
    FG_RED: "\x1b[31m",
    FG_GREEN: "\x1b[32m",
    FG_YELLOW: "\x1b[33m",
    FG_BLUE: "\x1b[34m",
    FG_MAGENTA: "\x1b[35m",
    FG_CYAN: "\x1b[36m",
    FG_WHITE: "\x1b[37m",
    BG_RED: "\x1b[41m",
    BG_GREEN: "\x1b[42m",
    BG_YELLOW: "\x1b[43m",
    BG_BLUE: "\x1b[44m",
    BG_MAGENTA: "\x1b[45m",
    BG_CYAN: "\x1b[46m",
    BG_WHITE: "\x1b[47m"
};

exports.log = function (text, color) {
    console.log(color, text, '\x1b[0m');
};

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