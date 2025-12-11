var express = require('express');
var router = express.Router();

const dbcon = require('../config/database');

/* GET pizzas listing. */
router.get('/',  async function (req, res, next) {
    try {
        const sqlQuery = 'SELECT * FROM pizzas';
        const [rows, fields] = await dbcon.execute(sqlQuery);
        res.json(rows);
    } catch (err) {
        console.error("Erreur de BDD", err.message);
        res.status(500).json({
            message: 'Erreur serveur : Impossible de lire la base de données.',
            error: err.message});
    }
});

router.post('/create', async (req, res) => {
    try {
        const { name, price } = req.body;
        if (!name || name.trim().length === 0 || price === undefined) {
            return res.status(400).json({ error: "Le nom et le prix de la pizza sont requis." });
        }
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({ error: "Le prix doit être un nombre positif valide." });
        }
        const sql = `INSERT INTO pizzas (name, price) VALUES (?,?)`;

        const [result] = await dbcon.query(sql, [name.trim(), parsedPrice]);

        res.json({
            message: `La pizza ${name.trim()} a bien été ajoutée !`,
            pizza: { id: result.insertId, name : name.trim(), price : parsedPrice },
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({error: `La pizza "${req.body.name}" existe déjà.`});
        }
        res.status(500).json({ error: "Erreur serveur" });
    }
});
module.exports = router;