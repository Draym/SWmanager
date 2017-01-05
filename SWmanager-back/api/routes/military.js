/**
 * Created by kevin on 03/01/2017.
 */
var express = require('express');
var router = express.Router();

var Military = require('../scripts/militaryData');

router.get('/findBestTargets', function (req, res, next) {
    Military.findBestTargets(req.query, function (err, planets) {
        if (err) {
            res.send({success: false, message: 'Internal error', errcode: 7});
        }
        else {
            res.send({success: true, 'planets': planets});
        }
    })
});


module.exports = router;