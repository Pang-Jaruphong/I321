var express = require('express');
var router = express.Router();

const dbcon = require('../config/database');

/* GET incredients listing. */
router.get('/',  async function (req, res, next) {
    try {
        const sqlQuery = 'SELECT * FROM ingredients';
        const [rows, fields] = await dbcon.execute(sqlQuery);
        res.json(rows);
    } catch (err) {
        console.error("Erreur de BDD", err.message);
        res.status(500).json({
            message: 'Erreur serveur : Impossible de lire la base de données.',
            error: err.message});
    }
});

module.exports = router;