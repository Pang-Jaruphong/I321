// Importation d'Express pour gérer les routes
import express from "express";

// Importation du pool MySQL pour communiquer avec la base de données
import pool from "../db/db.js";
import {ingredientsRouter} from "./ingredients.js";


const pizzasRouter = express.Router();

pizzasRouter.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT name FROM pizzas");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

pizzasRouter.post('/create/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const sql = `INSERT INTO pizzas (name) VALUES (?)`;
        const [result] = await pool.query(sql, [name]);

        res.json({
            message: `La pizza ${name} a bien été ajoutée !`,
            ingredient: { id: result.insertId, name }
        });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export { pizzasRouter };