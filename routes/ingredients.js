// Importation d'Express pour gérer les routes
import express from "express";

// Importation du pool MySQL pour communiquer avec la base de données
import pool from "../db/db.js";


const ingredientsRouter = express.Router();


ingredientsRouter.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT name FROM ingredients");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

ingredientsRouter.post('/create/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const sql = `INSERT INTO ingredients (name) VALUES (?)`;
        const [result] = await pool.query(sql, [name]);

        res.json({
            message: `L'ingrédient ${name} a bien été ajouté !`,
            ingredient: { id: result.insertId, name }
        });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});



export { ingredientsRouter };