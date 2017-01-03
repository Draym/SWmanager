/**
 * Created by kevin on 03/01/2017.
 */

var dataManager = require('./dataManager');

exports.findByPos = function(login, callback) {
    var planets = dataManager.getPlanets();
    var result = null;
    var err = true;

    if (planets) {
        for (var i = 0; i < planets.length; ++i) {
            if (planets[i].login == login) {
                result = planets[i];
                err = null;
                break;
            }
        }
    }
    callback(err, result);
};

exports.find = function(callback) {
    var result = dataManager.getPlanets();
    var err = null;

    if (!result|| result.length == 0) {
        err = true;
    }
    callback(err, result);
};