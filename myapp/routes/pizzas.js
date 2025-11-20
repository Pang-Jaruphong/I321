var express = require('express');
var router = express.Router();

/* GET pizzas listing. */
router.get('/', function(req, res, next) {
    res.send('liste de pizzas');
});

module.exports = router;