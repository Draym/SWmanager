/**
 * Created by kevin on 03/01/2017.
 */


var dataManager = require('./dataManager');

exports.findByLogin = function (login, callback) {
    var players = dataManager.getPlayers();
    var result = null;
    var err = true;

    if (players) {
        for (var i = 0; i < players.length; ++i) {
            if (players[i].pseudo == login) {
                result = players[i];
                err = null;
                break;
            }
        }
    }
    callback(err, result);
};

exports.find = function (callback) {
    var result = dataManager.getPlayers();
    var err = null;

    if (!result || result.length == 0) {
        err = true;
    }
    callback(err, result);
};