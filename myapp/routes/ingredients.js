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

router.post('/create', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ error: "Le nom de l'ingrédient est manquant dans l'URL." });
        }
        const sql = `INSERT INTO ingredients (name) VALUES (?)`;
        const [result] = await dbcon.query(sql, [name.trim()]);

        res.json({
            message: `L'ingrédient ${name} a bien été ajouté !`,
            ingredient: { id: result.insertId, name: name.trim() }
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ // 409 Conflict
                error: `L'ingrédient "${req.params.name}" existe déjà.`
            });
        }

        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.patch('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "ID invalide"
            });
        }

        if (!name || name.trim().length === 0) {
            return res.status(400).json({
                error: "Le nom est obligatoire"
            });
        }

        const sql = 'UPDATE ingredients SET name = ? WHERE id = ?';
        const [result] = await dbcon.query(sql, [name.trim(), id]);

        if (result.affectedRows === 0) {
            // rien n'a été modifié
            return res.status(404).json({
                error: "Ingrédient non trouvé ou aucune modification"
            });
        }

        return res.status(200).json({
            message: "Ingrédient modifié avec succès"
        });

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: "Ce nom existe déjà"
            });
        }

        console.error("Erreur serveur (PATCH /update/:id):", err);
        return res.status(500).json({
            error: "Erreur serveur"
        });
    }
});

module.exports = router;