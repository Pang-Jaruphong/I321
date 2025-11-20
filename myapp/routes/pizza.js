var express = require('express');
var router = express.Router();

/* GET pizza listing. */
router.get('/', function(req, res, next) {
    res.send('Element de la pizza selectionnée');
});

module.exports = router;