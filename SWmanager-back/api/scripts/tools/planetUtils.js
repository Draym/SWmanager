/**
 * Created by kevin on 05/01/2017.
 */

var Tools = require('./Tools');

/*** PLANETS UTILS ***/

function getDifferenceLevel(v1, v2) {
    var percent = 20;
    var point1 = parseFloat(v1);
    var point2 = parseFloat(v2);

    if (point2 < 1000000000000) {
        return "null";
    }
    if (point1 < 80000000000000) {
        percent = 80
    } else if (point1 < 200000000000000) {
        percent = 50;
    }
    if ((point1 + (point1 * percent / 100)) < point2) {
        return "higher";
    } else if ((point1 - (point1 * percent / 100)) > point2) {
        return "lower";
    } else if (point1 < point2){
        return "mediumPlus";
    } else {
        return "mediumLow";
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

function checkPlayerScore(player, type, requirements) {
    if (requirements.rank == 'null') {
        return getPlayerLevel(player, type, requirements) == requirements.level;
    } else {
        if (type == 'null') {
            return player.rank.total <= parseInt(requirements.rank);
        } else if (type == 'building') {
            return player.rank.building <= parseInt(requirements.rank);
        } else if (type == 'fleet') {
            return player.rank.fleet <= parseInt(requirements.rank);
        } else if (type == 'defense') {
            return player.rank.defense <= parseInt(requirements.rank);
        }
    }
}

exports.isPlanetAvailable = function(planet, requirements) {
    if (requirements.type == 'null' && requirements.level == 'null' && requirements.rank == 'null') {
        return true;
    }
    else if (requirements.type == 'null') {
        return checkPlayerScore(planet.player, 'null', requirements);
    }
    else if (planet.player.type == requirements.type) {
        if (requirements.level == 'null' && requirements.rank == 'null') {
            return true;
        }
        return checkPlayerScore(planet.player, requirements.type, requirements);
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