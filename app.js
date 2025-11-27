import express from "express";

// Import des routeurs
import { pizzasRouter } from "./routes/pizzas.js";
import { pizzaRouter } from "./routes/pizza.js";
import { ingredientsRouter } from "./routes/ingredients.js";
import { pizzaingredientsRouter } from "./routes/pizza.js";

const app = express();
const port = process.env.PORT || 3002;

// Middleware pour parser le JSON
app.use(express.json());

// Route de base pour tester le serveur
app.get("/", (req, res) => {
    res.send("API est en ligne !");
});

// Monte les routeurs sur leurs chemins respectifs
app.use("/pizzas", pizzasRouter);
app.use("/pizza", pizzaRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/pizza", pizzaingredientsRouter);

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});