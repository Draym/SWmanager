/**
 * Created by kevin on 05/01/2017.
 */

var Tools = require('./Tools');

/*** PLANETS UTILS ***/

function getDifferenceLevel(v1, v2) {
    var percent = 20;
    var point1 = parseFloat(v1);
    var point2 = parseFloat(v2);

    if (point1 < 10000000000000) {
        percent = 80
    } else if (point1 < 100000000000000) {
        percent = 50;
    }
    if ((point1 + (point1 * percent / 100)) < point2) {
        return "higher";
    } else if ((point1 - (point1 * percent / 100)) > point2) {
        return "lower";
    } else {
        return "medium";
    }
}

function getPlayerLevel(player, type, requirements) {
    if (type == 'null') {
        return getDifferenceLevel(requirements.scoreTotal, player.score.total);
    } else if (type == 'building') {
        return getDifferenceLevel(requirements.scoreBuilding, player.score.building);
    } else if (type == 'fleet') {
        return getDifferenceLevel(requirements.scoreFleet, player.score.fleet);
    } else if (type == 'defense') {
        return getDifferenceLevel(requirements.scoreDefense, player.score.defense);
    }
    return 'null';
}

exports.isPlanetAvailable = function(planet, requirements) {
    if (requirements.type == 'null' && requirements.level == 'null') {
        return true;
    }
    else if (requirements.type == 'null') {
        return getPlayerLevel(planet.player, 'null', requirements) == requirements.level;
    }
    else if (planet.player.type == requirements.type) {
        if (requirements.level == 'null') {
            return true;
        }
        return getPlayerLevel(planet.player, requirements.type, requirements) == requirements.level;
    }
    return false;
};

exports.distanceBetweenPlanets = function(planet1, planet2) {
    if (planet1.position.g != planet2.position.g) {
        return (20000 * Tools.diffNumbers(planet1.position.g, planet2.position.g));
    } else if (planet1.position.s == planet2.position.s) {
        return (1000 + (5 * Tools.diffNumbers(planet1.position.p, planet2.position.p)));
    } else {
        return (2700 + (95 * Tools.diffNumbers(planet1.position.s, planet2.position.s)));
    }
};