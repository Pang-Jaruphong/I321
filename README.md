I321_Jaruphong_Gaëtan

# Pizza API -Gestion de Pizzeria

# 1.1 Installation et set up :

Node.js et npm, télécharger depuis https://nodejs.org/fr

# 1.2 Cloner ou télécharger le projet : 

Avec Git clone https://github.com/Pang-Jaruphong/I321.git

Naviger avec l'API
cd myapp

# 1.3 Installer les dépendances :

Dans le fichier myapp : npm install

# 1.4 Configuration de la base de données :

Assurer d'avoir un serveur MySQL lancé
Modifier le fichier config/database.js avec les identifiants

# 1.5 Lancer l'application
npm start

L'application sera accessible sur http://localhost:3002
Ou modifier le fichier bin/www

# 2. Fonctions principaux
## Pizza
Get/pizzas : Liste toutes les pizzas  
Post/pizzas/create : Ajouter une nouvelle pizza  
Patch/pizzas/update/:id : Modifier une pizza existante  
Delete/pizzas/:id : Supprimer une pizza

## Ingrédients
Get/ingredients : Liste toutes les ingrédients  
Post/ingredients/create : Créer un ingrédient  
Delete/ingredients/:id : Supprimer un ingrédient

## Spécial (Pizza du jour)
Get/special : Récupérer la pizza du jour avec ses détails  
Patch/special/:id : Définir une pizza comme étant la pizza du jour

# 3. Technologies utilisées
Node.js & Express  
MySQL (avec mysql2)  
Swager (Documentation API)

# 4. Swagger documentation
Installation avec la commande dans le terminal :  
npm install swagger-jsdoc swagger-ui-express
