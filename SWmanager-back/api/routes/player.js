var express = require('express');
var router = express.Router();

var Player = require('../scripts/playerData');

router.get('/', function (req, res, next) {
    Player.findByLogin(req.query.pseudo, function (err, player) {
        if (err) {
            res.send({success: false, message: 'Internal error', errcode: 7});
        }
        else {
            res.send({success: true, 'player': player});
        }
    })
});

router.get('/all', function (req, res, next) {
    Player.find(function (err, players) {
        if (err) {
            res.send({success: false, message: 'Internal error', errcode: 7});
        }
        else {
            res.send({success: true, 'players': players});
        }
    })
});

module.exports = router;
