/**
 * Created by kevin on 05/01/2017.
 */

var dataManager = require('./dataManager');
var PlanetUtils = require('./tools/planetUtils');
var Tools = require('./tools/Tools');

function createNewGalaxyWithRestriction(requirements) {
    var galaxyPop = {};
    var planets = dataManager.getPlanets();

    // create galaxyPop
    for (var i = 1; i <= 6; ++i) {
        galaxyPop['galaxy_' + i] = {
            g: i,
            total: 0,
            percent: 0,
            systems: []
        };
        var min = 0;
        var max = 100;

        for (var i2 = 0; i2 < 5; ++i2) {
            galaxyPop['galaxy_' + i].systems.push({
                min: min,
                max: max,
                total: 0,
                galaxyPercent: 0,
                totalPercent: 0,
                totalI: 0,
                galaxyPercentI: 0,
                totalPercentI: 0,
            });
            min += 100;
            max += 100;
            max = (max == 500 ? 499 : max);
        }
    }
    // parse planets
    for (var i = 0; i < planets.length; ++i) {
        if (PlanetUtils.isPlanetAvailable(planets[i], requirements)) {
            galaxyPop['galaxy_' + planets[i].position.g].total += 1;
            for (var i2 = 0; i2 < galaxyPop['galaxy_' + planets[i].position.g].systems.length; ++i2) {
                if (planets[i].position.s >= galaxyPop['galaxy_' + planets[i].position.g].systems[i2].min
                    && planets[i].position.s < galaxyPop['galaxy_' + planets[i].position.g].systems[i2].max) {
                    galaxyPop['galaxy_' + planets[i].position.g].systems[i2].total += 1;
                    if (planets[i].player.inactif) {
                        galaxyPop['galaxy_' + planets[i].position.g].systems[i2].totalI += 1;
                    }
                }
            }
        }
    }

    // add percent
    for (var key in galaxyPop) {
        galaxyPop[key].percent = ((galaxyPop[key].total * 100) / planets.length).toFixed(2);
        for (var i = 0; i < galaxyPop[key].systems.length; ++i) {
            galaxyPop[key].systems[i].galaxyPercent = parseFloat(((galaxyPop[key].systems[i].total * 100) / galaxyPop[key].total).toFixed(2));
            galaxyPop[key].systems[i].totalPercent = parseFloat(((galaxyPop[key].systems[i].total * 100) / planets.length).toFixed(2));
            galaxyPop[key].systems[i].galaxyPercentI = parseFloat(((galaxyPop[key].systems[i].totalI * 100) / galaxyPop[key].total).toFixed(2));
            galaxyPop[key].systems[i].totalPercentI = parseFloat(((galaxyPop[key].systems[i].totalI * 100) / planets.length).toFixed(2));
        }
    }
    return galaxyPop;
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
    var galaxy = dataManager.getGalaxyPop();
    var result = null;
    var err = true;

    if (galaxy && requirements.g && requirements.people != 'null') {
        if (requirements.g != 0) {
            var id = 'galaxy_' + requirements.g;
            var tmp = galaxy[id];
            galaxy = {};
            galaxy[id] = tmp;
        }
        if (requirements.type != 'null' || requirements.level != 'null') {
            galaxy = createNewGalaxyWithRestriction(requirements)
        }
        if (Tools.isTrue(requirements.people)) {
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