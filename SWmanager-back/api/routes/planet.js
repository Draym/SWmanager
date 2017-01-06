/**
 * Created by kevin on 03/01/2017.
 */
var express = require('express');
var router = express.Router();

var Planet = require('../scripts/planetData');


router.get('/', function (req, res, next) {
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
            res.send({success: true, 'planets': planets});
        }
    })
});

router.get('/getPop', function (req, res, next) {
    Planet.getPop(function (err, pop) {
        if (err) {
            res.send({success: false, message: 'Internal error', errcode: 7});
        }
        else {
            res.send({success: true, 'pop': pop});
        }
    })
});

/*
 ** Deprecated use Colonize/findBest now
 */
router.get('/getBestNewPosition', function (req, res, next) {
    Planet.getBestNewPosition(req.query.requirements, function (err, system) {
        if (err) {
            res.send({success: false, message: 'Internal error', errcode: 7});
        }
        else {
            res.send({success: true, 'system': system});
        }
    })
});


module.exports = router;