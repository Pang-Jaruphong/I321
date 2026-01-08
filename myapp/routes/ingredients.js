var express = require('express');
var router = express.Router();

const dbcon = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Ingredient:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Mozzarella"
 */

/**
 * @swagger
 * /ingredients:
 *   get:
 *     summary: Liste des ingrédients
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: Liste des ingrédients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ingredient'
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /ingredients/create:
 *   post:
 *     summary: Ajouter un ingrédient
 *     tags: [Ingredients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ingredient'
 *     responses:
 *       200:
 *         description: Ingrédient ajouté avec succès
 *       400:
 *         description: Nom manquant ou invalide
 *       409:
 *         description: Ingrédient déjà existant
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /ingredients/{id}:
 *   delete:
 *     summary: Supprimer un ingrédient
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'ingrédient à supprimer
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Ingrédient supprimé avec succès
 *       404:
 *         description: Ingrédient non trouvé
 *       500:
 *         description: Erreur serveur
 */


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
            message: `L'ingrédient ${name.trim()} a bien été ajouté !`,
            ingredient: { id: result.insertId, name: name.trim() }
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ // 409 Conflict
                error: `L'ingrédient "${req.body.name}" existe déjà.`
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

        res.json({ message: `Ingrédient "${req.body.name}" supprimé avec succès.` });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la suppression", error: err.message });
    } finally {
        connection.release();
    }
});

module.exports = router;