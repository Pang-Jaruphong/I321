var express = require('express');
const dbcon = require("../config/database");
var router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     SpecialPizza:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Pizza du Chef"
 *         price:
 *           type: number
 *           example: 12.5
 *         description:
 *           type: string
 *           example: "Promo du jour"
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Fromage", "Tomate", "Basilic"]
 */

/**
 * @swagger
 * /special:
 *   get:
 *     summary: Récupérer la pizza du jour
 *     tags: [Special]
 *     responses:
 *       200:
 *         description: Pizza du jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SpecialPizza'
 *       404:
 *         description: Aucune pizza du jour
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /special/{id}:
 *   patch:
 *     summary: Définir une pizza comme pizza du jour
 *     tags: [Special]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la pizza à définir comme pizza du jour
 *         schema:
 *           type: integer
 *           example: 4
 *     responses:
 *       200:
 *         description: Pizza du jour mise à jour
 *       404:
 *         description: Pizza non trouvée
 *       500:
 *         description: Erreur serveur
 */


/* GET pizza listing. */
router.get('/',  async function (req, res, next) {
    try {
        const sqlQuery = `
            SELECT 
                p.id as pizza_id,
                p.name as pizza_name,
                p.price,
                i.name as ingredients_name,
                prom.description as description,
                prom.id as promotion_id
            FROM pizzas p 
            INNER JOIN composition c on p.id = c.pizzas_id
            INNER JOIN ingredients i on c.ingredients_id =i.id
            LEFT JOIN promotion prom on p.id = prom.pizzas_id
            where p.is_special = TRUE                    
        `;
        const [rows] = await dbcon.execute(sqlQuery);

        if (rows.length === 0) {
            return res.status(404).send({message : 'Aucune pizza du jour'})
        }
        // On construit l'objet de base à partir de la première ligne
        const specialPizza = {
            id: rows[0].pizza_id,
            name: rows[0].pizza_name,
            price: rows[0].price,
            description: rows[0].description,
            ingredients:[]
        };

        rows.forEach(row => {
            if (row.ingredients_name) { // On vérifie qu'il y a bien un ingrédient
                specialPizza.ingredients.push(row.ingredients_name);
            }
        });

        res.json(specialPizza);
    } catch (err) {
        console.error("Erreur de BDD", err.message);
        res.status(500).json({
            message: 'Erreur serveur : Impossible de lire la base de données.',
            error: err.message});
    }
});

// PATCH /pizzas/special/:id
// Aide de Gemini pour règler la fonction
router.patch('/:id', async function (req, res) {
    const pizzaId = req.params.id;
    const connection = await dbcon.getConnection();

    try {

        // Attention il faut vérifier que l'ID existe dans la base de données
        const [rows] = await connection.execute('SELECT id FROM pizzas WHERE id = ?', [pizzaId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Erreur : L'ID de pizza n'existe pas." });
        }

        // Opération pour modifier pizza du jour
        const [result] = await connection.execute(
            'UPDATE pizzas SET is_special = (id = ?)',
            [pizzaId]
        );

        res.json({
            message: "Pizza du jour mise à jour !" ,
            updatedId : pizzaId
        });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

module.exports = router;