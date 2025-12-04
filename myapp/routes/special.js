var express = require('express');
const dbcon = require("../config/database");
var router = express.Router();

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

        const specialPizza = {
            id: rows[0].pizza_id,
            name: rows[0].pizza_name,
            price: rows[0].price,
            description: rows[0].description,
            ingredients:[]
        };

        rows.forEach(row => {
            specialPizza.ingredients.push({
                name: row.ingredients_name,
                description:row.ingredients_description
            });
        });

        res.json(specialPizza);
    } catch (err) {
        console.error("Erreur de BDD", err.message);
        res.status(500).json({
            message: 'Erreur serveur : Impossible de lire la base de données.',
            error: err.message});
    }
});

module.exports = router;