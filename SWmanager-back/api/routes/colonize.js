/**
 * Created by kevin on 04/01/2017.
 */
var express = require('express');
var router = express.Router();

var Colonize = require('../scripts/colonizeData');

router.get('/findBest', function (req, res, next) {
    Colonize.findBest(req.query, function (err, planets) {
        if (err) {
            res.send({success: false, message: 'Internal error', errcode: 7});
        }
        else {
            res.send({success: true, 'planets': planets});
        }
    })
});

module.exports = router;