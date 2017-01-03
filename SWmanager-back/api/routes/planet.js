/**
 * Created by kevin on 03/01/2017.
 */
var express = require('express');
var router = express.Router();

var Planet = require('../scripts/planetData');


router.get('/', function (req, res, next) {
    console.log(req.query);
    Planet.findByPos(req.query.pos, function (err, planet) {
        if (err) {
            res.send({success: false, message: 'Internal error', errcode: 7});
        }
        else {
            res.send({success: true, 'planet': planet});
        }
    })
});

router.get('/all', function (req, res, next) {
    Planet.find(function (err, planets) {
        if (err) {
            res.send({success: false, message: 'Internal error', errcode: 7});
        }
        else {
            res.send({success: true, 'players': planets});
        }
    })
});

module.exports = router;