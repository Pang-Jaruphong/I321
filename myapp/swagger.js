// Aider par ChatGPT pour utilisation swagger
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Pizzeria",
            version: "1.0.0",
            description: "Documentation de l'API de gestion des pizzas",
        },
        servers: [
            {
                url: "http://localhost:3002",
                description: "Serveur local",
            },
        ],
    },
    apis: ["./routes/*.js"], // Swagger va lire pizzas.js
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec,
};
