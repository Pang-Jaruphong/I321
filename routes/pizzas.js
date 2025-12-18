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

pizzasRouter.delete('/delete/:name', async (req, res) => {
    try {
        const { name } = req.params;

        // Trouver l'id de la pizza
        const [rows] = await pool.query(
            "SELECT id FROM pizzas WHERE name = ?",
            [name]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Aucune pizza trouvée avec ce nom." });
        }

        const pizzaId = rows[0].id;

        // 1) Supprimer les compositions liées
        await pool.query("DELETE FROM composition WHERE pizzas_id = ?", [pizzaId]);

        // 2) Supprimer les promotions liées
        await pool.query("DELETE FROM promotion WHERE pizzas_id = ?", [pizzaId]);

        // 3) Supprimer la pizza
        await pool.query("DELETE FROM pizzas WHERE id = ?", [pizzaId]);

        res.json({ message: `La pizza ${name} a bien été supprimée !` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
}); //Cette manière de DELETE est une version améliorée de la précédente, proposée par ChatGPT

//Voici une variante permettant de supprimer par id.

pizzasRouter.delete('/deleteid/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 1) Supprimer les compositions liées
        await pool.query("DELETE FROM composition WHERE pizzas_id = ?", [id]);

        // 2) Supprimer les promotions liées
        await pool.query("DELETE FROM promotion WHERE pizzas_id = ?", [id]);

        // 3) Supprimer la pizza
        await pool.query("DELETE FROM pizzas WHERE id = ?", [id]);

        res.json({ message: `La pizza dont l'id est ${id} a bien été supprimée !` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

export { pizzasRouter };