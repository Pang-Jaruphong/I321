var express = require('express');
var router = express.Router();

const dbcon = require('../config/database');

/**
 * @swagger
 * components:
 *   schemas:
 *     Pizza:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Margherita"
 *         price:
 *           type: number
 *           example: 13.0
 */

/**
 * @swagger
 * /pizzas:
 *  get:
 *    summary: Liste des pizzas
 *    tags: [Pizzas]
 *    responses:
 *      200:
 *        description: Succès
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Pizza'
 */

/**
 * @swagger
 * /pizzas/create:
 *  post:
 *    summary: Ajouter une nouvelle pizza
 *    tags: [Pizzas]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Pizza'
 *    responses:
 *      200:
 *        description: Pizza ajoutée avec succès
 */

/**
 * @swagger
 * /pizzas/update/{id}:
 *   patch:
 *     summary: Modifier une pizza
 *     tags: [Pizzas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la pizza à modifier
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Margherita"
 *               price:
 *                 type: number
 *                 example: 13.0
 *     responses:
 *       200:
 *         description: Pizza modifiée avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Pizza non trouvée
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /pizzas/{id}:
 *   delete:
 *     summary: Supprimer une pizza
 *     tags: [Pizzas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la pizza à supprimer
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Pizza supprimée avec succès
 *       404:
 *         description: Pizza non trouvée
 *       500:
 *         description: Erreur serveur
 */

/* GET pizzas listing. */
router.get('/',  async function (req, res, next) {
    try {
        const sqlQuery = 'SELECT * FROM pizzas';
        const [rows] = await dbcon.execute(sqlQuery);
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

router.patch('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({error: "L'ID de la pizza est manquant"})
        }

        if (name === undefined && price === undefined) {
            return res.status(400).json({error: "Aucun champ n'a été fourni pour la modification"});
        }
        let sql = `UPDATE pizzas SET `;
        const values = [];
        const updates = [];

        if (name !== undefined){
            if (name.trim().length === 0){
                return res.status(400).json({error : "Le nom ne peut pas être vide."})
            }
            updates.push('name = ?');
            values.push(name.trim());
        }

        if (price !== undefined){
            const parsedPrice = parseFloat(price);
            if (isNaN(parsedPrice) || parsedPrice <= 0) {
                return res.status(400).json({error : "Le prix doit être un nombre possitif"})
            }
            updates.push('price = ?');
            values.push(parsedPrice);
        }

        sql += updates.join(', ') + " WHERE id = ?";
        values.push(id);
        // ajouter l'ID à la fin du tableau de valeurs

        // Exécution de la requête
        const [result] = await dbcon.query(sql, values);

        //Vérification du résultat
        if (result.affectedRows === 0) {
            // Si 0 ligne affectée, soit l'ID n'existe pas, soit les données n'ont pas changé
            const [check] = await dbcon.query('SELECT id FROM pizzas WHERE id = ?', [id]);
            if (check.length === 0) {
                return res.status(404).json({ message: `Pizza avec l'ID ${id} non trouvée.` });
            }
            // Si la pizza existe mais rien n'a changé
            return res.status(200).json({ message: `Pizza avec l'ID ${id} mise à jour (aucune modification appliquée).` });
        }

        res.status(200).json({
            message: `Pizza avec l'ID ${id} modifiée avec succès.`,
            changes: updates.map(u => u.split(' ')[0]) // Afficher les champs modifiés
        });

    } catch (err) {
        // Gestion des erreurs (Doublon, erreur serveur, etc.)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: `Ce nom de pizza existe déjà.` });
        }
        console.error("Erreur serveur (PATCH /update/:id):", err.message);
        res.status(500).json({ error: "Erreur serveur interne lors de la modification de la pizza." });
    }
})

router.delete('/:id', async function (req, res) {
    const pizzaId = req.params.id;
    const connection = await dbcon.getConnection(); // Récupérer une connexion pour la transaction

    try {
        await connection.beginTransaction();

        // 1. Supprimer les liens dans la table de composition (les ingrédients de cette pizza)
        await connection.execute('DELETE FROM composition WHERE pizzas_id = ?', [pizzaId]);

        // 2. Supprimer les éventuelles promotions liées
        await connection.execute('DELETE FROM promotion WHERE pizzas_id = ?', [pizzaId]);

        // 3. Supprimer la pizza elle-même
        const [result] = await connection.execute('DELETE FROM pizzas WHERE id = ?', [pizzaId]);

        await connection.commit();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Pizza non trouvée" });
        }

        res.json({ message: `Pizza "${req.body.name}" supprimée avec succès` });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la suppression", error: err.message });
    } finally {
        connection.release();
    }
});
module.exports = router;