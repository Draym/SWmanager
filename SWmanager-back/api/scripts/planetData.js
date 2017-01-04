/**
 * Created by kevin on 03/01/2017.
 */

var dataManager = require('./dataManager');

/*** UTILS ***/
function getBestNewPositionByG(g, hasPeople) {
    var result = -1;
    var value = 0;

    for (var i = 0; i < dataManager.getGalaxyPop()["galaxy_" + g].systems.length; ++i) {
        if (hasPeople) {
            if (result == -1 || value < dataManager.getGalaxyPop()["galaxy_" + g].systems.percent) {
                value = dataManager.getGalaxyPop()["galaxy_" + g].systems.percent;
                result = i;
            }
        } else {
            if (result == -1 || value > dataManager.getGalaxyPop()["galaxy_" + g].systems.percent) {
                value = dataManager.getGalaxyPop()["galaxy_" + g].systems.percent;
                result = i;
            }
        }
    }
    return dataManager.getGalaxyPop()["galaxy_" + g].systems[result];
}

function getBestNewPositionWithAll(hasPeople) {
    var result = -1;
    var value = 0;

    for (var i = 1; i <= 6; ++i) {
        if (hasPeople) {
            if (result == -1 || value < dataManager.getGalaxyPop()["galaxy_" + i].percent) {
                value = dataManager.getGalaxyPop()["galaxy_" + i].percent;
                result = i;
            }
        } else {
            if (result == -1 || value > dataManager.getGalaxyPop()["galaxy_" + i].percent) {
                value = dataManager.getGalaxyPop()["galaxy_" + i].percent;
                result = i;
            }
        }
    }
    return getBestNewPositionByG(result, hasPeople);
}

/*** EXTERNAL GET ***/
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

exports.getPop = function(callback) {
    callback(null, dataManager.getGalaxyPop())
};

exports.getBestNewPosition = function(requirements, callback) {
    if (requirements.g != 0) {
        callback(null, getBestNewPositionByG(requirements.g, requirements.hasPeople));
    } else {
        callback(null, getBestNewPositionWithAll(requirements.hasPeople));
    }
};