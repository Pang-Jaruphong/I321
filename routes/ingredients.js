// Importation d'Express pour gérer les routes
import express from "express";

// Importation du pool MySQL pour communiquer avec la base de données
import pool from "../db/db.js";


const ingredientsRouter = express.Router();
//const pizzaRouter = express.Router();


ingredientsRouter.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT name FROM ingredients");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export { ingredientsRouter };