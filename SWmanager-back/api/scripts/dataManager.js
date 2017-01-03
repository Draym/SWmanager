/**
 * Created by kevin on 03/01/2017.
 */

var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();
var Tools = require("./Tools");

// data parsed and created
var players = [];
var planets = [];

// data utils
var galaxyPop = [{"0-100" : 0}];

// original data
var dataBase = {};

exports.getPlayers = function () {
    return players;
};

exports.getPlanets = function () {
    return planets;
};

/*** TOOLS ***/
function launchCallback(db, callbacks) {
    if (callbacks.length != 0) {
        var callback = callbacks[0];
        callbacks.splice(0, 1);
        callback(db, callbacks);
    }
}

/*** GETTERS ***/
function getPlayerPosByLogin(login) {
    for (var i = 0; i < players.length; ++i) {
        if (players[i].pseudo == login) {
            return i;
        }
    }
    return -1;
}

/*** DATA BASE ***/
function collectGalaxy(db, callbacks) {
    db.all("SELECT * from scriptvals where name = 'galaxy_data_18'", function (err, rows) {
        if (!err && rows.length > 0) {
            //take galaxy 18
            var galaxy;
            for (var i = 0; i < rows.length; ++i){
                if (rows[i].name == 'galaxy_data_18') {
                    galaxy = rows[i];
                }
            }
            var all = Tools.dataToJson(galaxy.value);

            dataBase.universe = all.universe;
            dataBase.players = all.players;

            launchCallback(db, callbacks);
        }
    });
}

function collectInactif(db, callbacks) {
    db.all("SELECT * from scriptvals where name = 'InactiveList'", function (err, rows) {
        if (!err && rows.length > 0) {

            dataBase.inactifs = Tools.dataToJson(rows[0].value);
            launchCallback(db, callbacks);
        }
    });
}

function collectScore(db, callbacks) {
    db.all("SELECT * from scriptvals where name = 'fleet_points_uni_18'", function (err, rows) {
        if (!err && rows.length > 0) {
            //take galaxy 18
            var galaxy;
            for (var i = 0; i < rows.length; ++i){
                if (rows[i].name == 'fleet_points_uni_18') {
                    galaxy = rows[i];
                }
            }
            var all = Tools.dataToJson(galaxy.value);

            dataBase.score = {};
            dataBase.score.players = all['1'];
            dataBase.score.team = all['2'];
            launchCallback(db, callbacks);
        }
    });
}

/*** TRANSFORM ***/

function transformPlanetPosition(pos) {
    var vals = pos.split(":");
    return {
        g: parseInt(vals[0]),
        s: parseInt(vals[1]),
        p: parseInt(vals[2])
    }
}

function transforPlanetsPosition(array) {
    var result = [];

    for (var i = 0; i < array.length; ++i) {
        result.push(transformPlanetPosition(array[i]));
    }
    return result;
}

/*** PARSING ***/
function createPlayers() {
    players.length = 0;
    for (var key in dataBase.players) {
        players.push({
            pseudo: key,
            planets: transforPlanetsPosition(dataBase.players[key][0]),
            moons: transforPlanetsPosition(dataBase.players[key][1]),
            score: {},
            inactif: false
        });
    }
}

function createPlanets() {
    planets.length = 0;
    for (var key in dataBase.universe) {
        planets.push({
            position: transformPlanetPosition(key),
            player: dataBase.universe[key],
        });
    }
}

function addScoreToPlayer() {
    for (var key in dataBase.score.players) {
        var i = getPlayerPosByLogin(key);

        if (i != -1) {
            players[i].score.total = parseFloat(dataBase.score.players[key]['1']);
            players[i].score.research = parseFloat(dataBase.score.players[key]['3']);
            players[i].score.building = parseFloat(dataBase.score.players[key]['4']);
            players[i].score.defense = parseFloat(dataBase.score.players[key]['5']);
            players[i].score.fleet = players[i].score.total - (players[i].score.research + players[i].score.building + players[i].score.defense);
        }
    }
}

function addInactifStatusToPlayer() {
    for (var key in dataBase.inactifs) {
        var i = getPlayerPosByLogin(key);

        if (i != -1) {
            players[i].inactif = dataBase.inactifs[key];
        }
    }
}

/*** Manager ***/
function parseCollectedData(db, callbacks) {
    createPlayers();
    createPlanets();
    addScoreToPlayer();
    addInactifStatusToPlayer();
    launchCallback(db, callbacks);
}

function calculUtilsData(db, callbacks) {
    launchCallback(db, callbacks);
}

exports.parseData = function () {
    var file = "../data/data.db";
    var exists = fs.existsSync(file);
    var db = new sqlite3.Database(file);
    console.log(exists);
    if (exists) {
        collectGalaxy(db, [collectInactif, collectScore, parseCollectedData, calculUtilsData]);
    }
};