var express = require('express');
var router = express.Router();

/* GET pizzas listing. */
router.get('/', function(req, res, next) {
    res.send('Liste de pizzas');
});

module.exports = router;