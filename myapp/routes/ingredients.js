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

router.delete('/:id', async function (req, res) {
    const ingredientId = req.params.id;
    const connection = await dbcon.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Supprimer l'ingrédient de toutes les compositions de pizzas
        // Cela évite l'erreur de contrainte (Foreign Key Constraint)
        await connection.execute('DELETE FROM composition WHERE ingredients_id = ?', [ingredientId]);

        // 2. Supprimer l'ingrédient de la table ingredients
        const [result] = await connection.execute('DELETE FROM ingredients WHERE id = ?', [ingredientId]);

        await connection.commit();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Ingrédient non trouvé." });
        }

        res.json({ message: "Ingrédient supprimé avec succès." });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la suppression", error: err.message });
    } finally {
        connection.release();
    }
});

module.exports = router;