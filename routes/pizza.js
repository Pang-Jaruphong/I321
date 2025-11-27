// Importation d'Express pour gérer les routes
import express from "express";

// Importation du pool MySQL pour communiquer avec la base de données
import pool from "../db/db.js";


const pizzaRouter = express.Router();
const pizzaingredientsRouter = express.Router();


pizzaRouter.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await pool.query("SELECT * FROM pizzas WHERE id = ?", [id]);
        res.json(rows[0] || {});
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

pizzaingredientsRouter.get('/:id/ingredients', async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await pool.query("SELECT i.id, i.name\n FROM composition c\n INNER JOIN ingredients i ON c.incredients_id = i.id\n WHERE c.pizzas_id = ?", [id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export { pizzaRouter };
export { pizzaingredientsRouter };