/**
 * Created by kevin on 05/01/2017.
 */

var dataManager = require('./dataManager');
var Tools = require('./Tools');

function isTrue(value) {
    return value == 'true';
}

function parseGalaxyByType(galaxy, type) {

}

function parseGalaxyByLevel(galaxy, level) {

}

function getSystemMostPeople(galaxy, inactif) {
    var g = -1;
    var s = -1;
    var totalG = 0;
    var totalP = 0;

    for (var key in galaxy) {
        if (g == -1) {
            g = key;
        }
        for (var i = 0; i < galaxy[key].systems.length; ++i) {
            if (s == -1) {
                s = i;
            }
            if (inactif == 'true') {
                if (galaxy[key].systems[i].totalI > galaxy[g].systems[s].totalI) {
                    g = key;
                    s = i;
                }
                totalP += galaxy[key].systems[i].totalI;
            } else if (inactif == 'false') {
                if ((galaxy[key].systems[i].total - galaxy[key].systems[i].totalI) > (galaxy[g].systems[s].total - galaxy[g].systems[s].totalI)) {
                    g = key;
                    s = i;
                }
                totalP += (galaxy[key].systems[i].total - galaxy[key].systems[i].totalI);
            } else {
                if (galaxy[key].systems[i].total > galaxy[g].systems[s].total) {
                    g = key;
                    s = i;
                }
                totalP += galaxy[key].systems[i].total;
            }
        }
        totalG += 1;
    }
    galaxy[g].systems[s].g = galaxy[g].g;
    galaxy[g].systems[s].galaxyParsed = totalG;
    galaxy[g].systems[s].planetsParsed = totalP;
    return galaxy[g].systems[s];
}

function getSystemLessPeople(galaxy, inactif) {
    var g = -1;
    var s = -1;
    var totalG = 0;
    var totalP = 0;

    for (var key in galaxy) {
        if (g == -1) {
            g = key;
        }
        for (var i = 0; i < galaxy[key].systems.length; ++i) {
            if (s == -1) {
                s = i;
            }
            if (inactif == 'true') {
                if (galaxy[key].systems[i].totalI < galaxy[g].systems[s].totalI) {
                    g = key;
                    s = i;
                }
                totalP += galaxy[key].systems[i].totalI;
            } else if (inactif == 'false') {
                if ((galaxy[key].systems[i].total - galaxy[key].systems[i].totalI) < (galaxy[g].systems[s].total - galaxy[g].systems[s].totalI)) {
                    g = key;
                    s = i;
                }
                totalP += (galaxy[key].systems[i].total - galaxy[key].systems[i].totalI);
            } else {
                if (galaxy[key].systems[i].total < galaxy[g].systems[s].total) {
                    g = key;
                    s = i;
                }
                totalP += galaxy[key].systems[i].total;
            }
        }
        totalG += 1;
    }
    galaxy[g].systems[s].g = galaxy[g].g;
    galaxy[g].systems[s].galaxyParsed = totalG;
    galaxy[g].systems[s].planetsParsed = totalP;
    return galaxy[g].systems[s];
}

exports.findBest = function (requirements, callback) {
    var galaxy = Tools.cloneObject(dataManager.getGalaxyPop());
    var result = null;
    var err = true;

    if (galaxy && requirements.g && requirements.people != 'null') {
        if (requirements.g != 0) {
            var id = 'galaxy_' + requirements.g;
            var tmp = galaxy[id];
            galaxy = {};
            galaxy[id] = tmp;
        }
        if (requirements.type != 'null') {
            parseGalaxyByType(galaxy, requirements.type);
        }
        if (requirements.level != 'null') {
            parseGalaxyByLevel(galaxy, requirements.level);
        }
        if (isTrue(requirements.people)) {
            result = getSystemMostPeople(galaxy, requirements.inactif);
        } else {
            result = getSystemLessPeople(galaxy, requirements.inactif);
        }
    }
    if (result != null) {
        result.requirements = requirements;
        err = null;
    }
    callback(err, result);
};