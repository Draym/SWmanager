/**
 * Created by kevin on 05/01/2017.
 */


var dataManager = require('./dataManager');
var Tools = require('./tools/Tools');
var PlanetUtils = require('./tools/planetUtils');

function parsePlanetsByRequirements(planets, requirements) {
    var remove = false;
    var playerPlanet = dataManager.findPlanet(requirements.planetId);

    for (var i = 0; i < planets.length; ++i) {
        remove = false;
        if (playerPlanet.position.full != planets[i].position.full
            && Tools.numberInRange(PlanetUtils.distanceBetweenPlanets(playerPlanet, planets[i]), requirements.minDist, requirements.maxDist)) {
            if (requirements.inactif != 'null' && Tools.isTrue(requirements.inactif) != planets[i].player.inactif) {
                remove = true;
            } else if (requirements.bot != 'null' && Tools.isTrue(requirements.bot) != planets[i].player.bot) {
                remove = true;
            } else if (!PlanetUtils.isPlanetAvailable(planets[i], requirements)) {
                remove = true;
            }
        } else {
            remove = true;
        }
        if (remove) {
            planets.splice(i, 1);
            --i;
        }
    }
    return planets;
}

exports.findBestTargets = function (requirements, callback) {
    var planets = dataManager.getPlanets();
    var nbPlanets = planets.length;
    var result = null;
    var err = true;

    if (planets) {
        result = {
            planets: parsePlanetsByRequirements(planets, requirements),
            galaxyParsed: 6,
            planetsParsed: nbPlanets
        };
    }
    if (result != null) {
        result.requirements = requirements;
        err = null;
    }
    callback(err, result);
};