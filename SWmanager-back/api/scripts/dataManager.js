/**
 * Created by kevin on 03/01/2017.
 */

var fs = require("fs");
var sqlite3 = require("sqlite3").verbose();
var Tools = require("./tools/Tools");
var Log = require("./tools/logUtils");
var Clone = require("./tools/cloneUtils");

// data parsed and created
var players = [];
var planets = [];

// data utils
var galaxyPop = {};

// original data
var dataBase = {};

/*** EXTERNAL GETTERS ***/
exports.getPlayers = function () {
    return Clone.cloneArray(players);
};

exports.getPlanets = function () {
    return Clone.cloneArray(planets);
};

exports.getGalaxyPop = function () {
    return Clone.cloneObject(galaxyPop);
};

/*** EXTERNAL FIND ***/
exports.findPlanet = function (id) {
    if (planets) {
        for (var i = 0; i < planets.length; ++i) {
            if (planets[i].position.full == id) {
                return Clone.cloneObject(planets[i]);
            }
        }
    }
    return null;
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
            for (var i = 0; i < rows.length; ++i) {
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
            for (var i = 0; i < rows.length; ++i) {
                if (rows[i].name == 'fleet_points_uni_18') {
                    galaxy = rows[i];
                }
            }
            var all = Tools.dataToJson(galaxy.value);

            dataBase.score = {};
            dataBase.score.players = all['1'];
            for (var key in all['3']) {
                dataBase.score.players[key] = all['3'][key];
            }
            dataBase.score.team = all['2'];
            launchCallback(db, callbacks);
        }
    });
}

/*** TRANSFORM ***/

function transformPlanetPosition(pos) {
    var vals = pos.split(":");
    return {
        full: pos,
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
            rank: {},
            inactif: false,
            bot: (key.indexOf("Bot_") == 0),
            type: ""
        });
    }
}

function createPlanets() {
    planets.length = 0;
    for (var key in dataBase.universe) {
        planets.push({
            position: transformPlanetPosition(key),
            player: players[getPlayerPosByLogin(dataBase.universe[key])]
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

            if (players[i].score.building >= players[i].score.fleet
                && players[i].score.building >= players[i].score.defense) {
                players[i].type = "building";
            } else if (players[i].score.fleet >= players[i].score.building
                && players[i].score.fleet >= players[i].score.defense) {
                players[i].type = "fleet";
            } else {
                players[i].type = 'defense';
            }
        }
    }
}

function addRankToPlayer() {
    for (var key in dataBase.score.players) {
        var i = getPlayerPosByLogin(key);

        if (i != -1) {
            players[i].rank.total = 1;
            players[i].rank.building = 1;
            players[i].rank.fleet = 1;
            players[i].rank.research = 1;
            players[i].rank.defense = 1;
            for (var i2 = 0; i2 < players.length; ++i2) {
                if (i != i2 && players[i].bot == players[i2].bot) {
                    if (players[i2].score.total > players[i].score.total) {
                        players[i].rank.total += 1;
                    }
                    if (players[i2].score.building > players[i].score.building) {
                        players[i].rank.building += 1;
                    }
                    if (players[i2].score.fleet > players[i].score.fleet) {
                        players[i].rank.fleet += 1;
                    }
                    if (players[i2].score.research > players[i].score.research) {
                        players[i].rank.research += 1;
                    }
                    if (players[i2].score.defense > players[i].score.defense) {
                        players[i].rank.defense += 1;
                    }
                }
            }
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

/*** calculation ***/

function calculationGalaxyPop() {

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
                totalPercentI: 0
            });
            min += 100;
            max += 100;
            max = (max == 500 ? 499 : max);
        }
    }

    // parse planets
    for (var i = 0; i < planets.length; ++i) {
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
}

/*** Manager ***/
function parseCollectedData(db, callbacks) {
    createPlayers();
    createPlanets();
    addScoreToPlayer();
    addRankToPlayer();
    addInactifStatusToPlayer();
    Log.log("[server][DONE] parse Data", Log.colors.FG_MAGENTA);
    launchCallback(db, callbacks);
}

function calculationUtilsData(db, callbacks) {
    calculationGalaxyPop();
    Log.log("[server][DONE] calculation with Data", Log.colors.FG_MAGENTA);
    launchCallback(db, callbacks);
}

exports.parseData = function () {
    var file = "../data/data.db";
    var exists = fs.existsSync(file);
    var db = new sqlite3.Database(file);
    Log.log("[server] DataBase available", Log.colors.FG_CYAN);
    if (exists) {
        collectGalaxy(db, [collectInactif, collectScore, parseCollectedData, calculationUtilsData]);
    }
};